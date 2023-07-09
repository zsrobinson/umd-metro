export default async function Page() {
  const trains = await getRailPredictions();

  return (
    <main className="p-8">
      <h1>UMD Metro</h1>
      <p className="whitespace-pre font-mono">
        {JSON.stringify(trains, null, 2)}
      </p>
    </main>
  );
}

type RailPrediction = {
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
      next: { revalidate: 60 },
    }
  );

  const data = await req.json();

  // I would validate this but they don't seem to really stick to their schema
  return data.Trains as RailPrediction[];
}
