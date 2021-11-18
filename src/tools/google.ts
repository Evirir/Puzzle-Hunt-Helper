import {google} from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const MIME_TYPE = 'application/vnd.google-apps.spreadsheet';

const client = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    SCOPES,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY_ID
);

const drive = google.drive({version: 'v3', auth: client});

const createSheets = async (docName: any) => {
    const createFile = async (resource: any) => await drive.files.create(resource);
    const response = await createFile({
        resource: {
            name: docName,
            mimeType: MIME_TYPE,
            writersCanShare: true
        }
    }).catch(e => console.log(e));

    const docId = response!.data.id;
    await addPermission(docId);
    return `https://docs.google.com/spreadsheets/d/${docId}`;
};

const addPermission = async (docId: any) => {
    const resource = {'type': 'anyone', 'role': 'writer'};
    // @ts-ignore
    await drive.permissions.create({
        fileId: docId,
        resource: resource
    });
};

export default createSheets;