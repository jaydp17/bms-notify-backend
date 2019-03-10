export const env: string = process.env.NODE_ENV || 'development';

export const isProd: boolean = env === 'production';

export const dynamoTablesPrefix = `bms-notify${isProd ? '' : '-dev'}`;
