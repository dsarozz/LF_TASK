import * as fs from 'fs';
const stream = require('stream');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */
type PartialDriveFile = {
    id: string;
    name: string;
};

type SearchResultResponse = {
    kind: 'drive#fileList';
    nextPageToken: string;
    incompleteSearch: boolean;
    files: PartialDriveFile[];
};

export class GoogleDriveService {
    private driveClient;

    public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
        this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
    }

    createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
        const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

        client.setCredentials({ refresh_token: refreshToken });

        return google.drive({
            version: 'v3',
            auth: client,
        });
    }

    createFolder(folderName: string): Promise<PartialDriveFile> {
        return this.driveClient.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            },
            fields: 'id, name',
        });
    }

    searchFolder(folderName: string): Promise<PartialDriveFile | null> {
        return new Promise((resolve, reject) => {
            this.driveClient.files.list(
                {
                    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
                    fields: 'files(id, name)',
                },
                (err, res: { data: SearchResultResponse }) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(res.data.files ? res.data.files[0] : null);
                },
            );
        });
    }

    saveFile(folderName: string, fileName: string, fileBuffer: Buffer, fileMimeType: string) {
        let folder: any = this.searchFolder(folderName).catch((error) => {
            console.error(error);
            return null;
        });

        if (!folder) {
            folder = this.createFolder(folderName);
        }

        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileBuffer);
        return this.driveClient.files.create({
            requestBody: {
                name: fileName,
                parents: [folder.id],
            },
            media: {
                mimeType: fileMimeType,
                body: bufferStream,
            },
        });
    }

    getFile(fileId: string) {
        return new Promise((resolve, reject) => {
            this.driveClient.files.get(
                { fileId, alt: "media", },
                { responseType: "stream" },
                (err, { data }) => {
                    if (err) {
                        return reject(err)
                    }
                    let buf = [];
                    data.on("data", (e) => buf.push(e));
                    data.on("end", () => {
                        const buffer = Buffer.concat(buf);
                        let base64Value = new Buffer(buffer).toString('base64');
                        base64Value = `data:image/jpeg;base64,${base64Value}`;
                        return resolve(base64Value)
                    });
                }
            );
        });
    }
}