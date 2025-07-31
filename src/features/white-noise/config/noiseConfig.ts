export interface NoiseConfig {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export const NOISE_CONFIGS: NoiseConfig[] = [
  {
    id: 'rain',
    name: '빗소리',
    url: '/audio/white-noise/rain.mp3',
    description: '빗방울이 떨어지는 소리',
  },
  {
    id: 'fireplace',
    name: '장작 타는 소리',
    url: '/audio/white-noise/fireplace.mp3',
    description: '따뜻한 벽난로 소리',
  },
  {
    id: 'typing',
    name: '타자 소리',
    url: '/audio/white-noise/typing.mp3',
    description: '키보드 타이핑 소리',
  },
  {
    id: 'water',
    name: '물 소리',
    url: '/audio/white-noise/water.mp3',
    description: '계곡물 소리',
  },
  {
    id: 'library',
    name: '도서관 소리',
    url: '/audio/white-noise/library.mp3',
    description: '도서관 소리',
  },
  {
    id: 'forest',
    name: '숲 소리',
    url: '/audio/white-noise/forest.mp3',
    description: '숲소리',
  },
  {
    id: 'brown-noise',
    name: '브라운 노이즈',
    url: '/audio/white-noise/brown-noise.mp3',
    description: '브라운 노이즈',
  },
  {
    id: 'leaves-steps',
    name: '낙엽 소리',
    url: '/audio/white-noise/leaves-steps.mp3',
    description: '낙엽을 밟는 소리',
  },
];

export const getNoiseUrl = (noiseId: string): string => {
  const config = NOISE_CONFIGS.find((noise) => noise.id === noiseId);
  return config?.url || '';
};

export const getNoiseName = (noiseId: string): string => {
  const config = NOISE_CONFIGS.find((noise) => noise.id === noiseId);
  return config?.name || noiseId;
};

export const getNoiseIds = (): string[] => {
  return NOISE_CONFIGS.map((noise) => noise.id);
};
