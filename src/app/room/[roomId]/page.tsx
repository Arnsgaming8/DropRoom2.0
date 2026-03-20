import { RoomClient } from "./RoomClient";

export function generateStaticParams() {
  return [
    { roomId: "abc123" },
    { roomId: "demo" },
    { roomId: "test" },
  ];
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  return <RoomClient params={params} />;
}
