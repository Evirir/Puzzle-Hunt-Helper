const {google} = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const MIME_TYPE = 'application/vnd.google-apps.spreadsheet';

const client = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    SCOPES,
    null,
    process.env.GOOGLE_PRIVATE_KEY_ID
);

const drive = google.drive({version: 'v3', auth: client});

createSheets = async (docName) => {
    try {
        const response = await drive.files.create({
            resource: {
                name: docName,
                mimeType: MIME_TYPE,
                writersCanShare: true
            }
        });
        const docId = response.data.id;
        await addPermission(docId);
        return `https://docs.google.com/spreadsheets/d/${docId}`;
    } catch(err) {
        console.log(err);
    }
};

addPermission = async (docId) => {
    const resource = {'type': 'anyone', 'role': 'writer'};
    await drive.permissions.create({
        fileId: docId,
        resource: resource
    });
};

module.exports = createSheets;