import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class BcryptService implements HashingService{
    async hash(data: string | Buffer): Promise<string> {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(data, salt)
    }

    async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
        return await bcrypt.compare(data, encrypted)
    }
}