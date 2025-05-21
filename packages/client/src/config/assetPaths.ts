export const MODEL_BASE_URL = 'https://synergy-assets-11412.s3.us-west-2.amazonaws.com/models';

export const getModelUrl = (name: string): string => `${MODEL_BASE_URL}/${name}`;