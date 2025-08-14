import { useRoomInfoQuery } from '@/entities/room/api/queries';
import { adaptRoomFromApi } from '@/entities/room/model/adapters';

const DEFAULT_FOCUS_TIME = 0;

interface RoomInfoProps {
  roomId: number;
}

export const RoomInfo = ({ roomId }: RoomInfoProps) => {
  const { data, isLoading, error } = useRoomInfoQuery(roomId);
  const room = data ? adaptRoomFromApi(data) : null;

  if (isLoading) return <RoomInfoSkeleton />;

  if (error)
    return <div className="text-white">방 정보를 불러올 수 없습니다.</div>;
  if (!room) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{room.title}</h2>
          <p className="text-sm text-gray-600 mt-1">방장: {room.creatorName}</p>

          {room.description && (
            <p className="text-gray-700 mt-2">{room.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {room.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {room.currentParticipants}/{room.maxParticipants}
          </div>
          <div className="text-sm text-gray-600">참가자</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {room.focusTime || DEFAULT_FOCUS_TIME}분
          </div>
          <div className="text-sm text-gray-600">집중 시간</div>
        </div>
      </div>

      {room.hasPassword && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">🔒</span>
            <span className="text-sm text-yellow-800">비공개 방입니다</span>
          </div>
        </div>
      )}
    </div>
  );
};

const RoomInfoSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
