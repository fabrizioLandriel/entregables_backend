import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto"
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SECRET="CoderCoder123"
// export const generaHash=password=>crypto.createHmac("sha256", SECRET).update(password).digest("hex")
export const generaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPasword = (password, passwordHash) => {
    if (!password || !passwordHash) {
        console.error("Password or passwordHash is undefined");
        return false;
    }
    return bcrypt.compareSync(password, passwordHash);
}

export default __dirname;
