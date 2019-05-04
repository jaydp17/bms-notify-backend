export const env: string = process.env.NODE_ENV || 'development';

export const isProd = env === 'production';
export const isStaging = env === 'staging';
export const isDev = env === 'development';

export const dynamoTablesPrefix = `bms-notify-${env}`;
