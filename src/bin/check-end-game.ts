import { handler } from '../crons/endgame-checker';

handler().catch(error => console.error(error));
