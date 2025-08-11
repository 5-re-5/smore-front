import { RoomCreateForm } from '@/features/room-create';

function RoomCreatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-start">
          스터디 만들기
        </h1>
        <RoomCreateForm />
      </div>
    </div>
  );
}

export default RoomCreatePage;
