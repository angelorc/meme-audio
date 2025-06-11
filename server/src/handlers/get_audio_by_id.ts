
import { type GetAudioByIdInput, type AudioClip } from '../schema';

export declare function getAudioById(input: GetAudioByIdInput): Promise<AudioClip | null>;
