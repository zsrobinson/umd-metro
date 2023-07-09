export default async function Page() {
  const trains = await getRailPredictions();
  const uniqueTrains = getUniqueTrains(trains);

  return (
    <main className="flex flex-col gap-4 p-8">
      <h1>UMD Metro · Upcoming Trains</h1>

      {uniqueTrains.map((train) => (
        <div className="flex items-center gap-4" key={train.destination}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-800 text-5xl font-bold">
            {train.line}
          </div>
          <div className="flex flex-col">
            <p className="text-3xl font-semibold uppercase">
              {train.destination}
            </p>
            <p className="text-xl text-zinc-400">
              {train.isBoarding ? "Boarding" : train.isArriving && "Arriving"}
              {(train.isArriving || train.isBoarding) && " · "}

              {train.minutes.length === 0 && "No upcoming trains"}
              {train.minutes.length > 0 && train.minutes.join(", ") + " min"}
            </p>
          </div>
        </div>
      ))}
    </main>
  );
}

type APIRailPrediction = {
  Car: string;
  Destination: string;
  DestinationCode: string;
  DestinationName: string;
  Group: string;
  Line: string;
  LocationCode: string;
  LocationName: string;
  Min: string;
};

async function getRailPredictions(station: string = "E09") {
  const req = await fetch(
    `https://api.wmata.com/StationPrediction.svc/json/GetPrediction/${station}`,
    {
      // this is the demo key don't worry
      headers: { api_key: "e13626d03d8e4c03ac07f95541b3091b" },
      // next: { revalidate: 60 },
    }
  );

  const data = await req.json();

  // I would validate this but they don't seem to really stick to their schema
  return data.Trains as APIRailPrediction[];
}

type UniqueTrain = {
  destination: string;
  line: string;
  minutes: number[];
  isBoarding?: boolean;
  isArriving?: boolean;
};

function getUniqueTrains(trains: APIRailPrediction[]) {
  const uniqueTrains: UniqueTrain[] = [];

  for (const train of trains) {
    const isBoarding = train.Min === "BRD";
    const isArriving = train.Min === "ARR";

    const existingTrain = uniqueTrains.find(
      (t) => t.destination === train.DestinationName && t.line === train.Line
    );

    if (existingTrain) {
      if (isBoarding) {
        existingTrain.isBoarding = true;
        continue;
      } else if (isArriving) {
        existingTrain.isArriving = true;
        continue;
      }

      existingTrain.minutes.push(Number(train.Min));
      existingTrain.minutes.sort((a, b) => a - b);
      continue;
    }

    uniqueTrains.push({
      destination: train.DestinationName,
      line: train.Line,
      isBoarding,
      isArriving,
      minutes: isBoarding || isArriving ? [] : [Number(train.Min)],
    });
  }

  // sort based on destination name
  uniqueTrains.sort((a, b) => a.destination.localeCompare(b.destination));

  return uniqueTrains;
}
