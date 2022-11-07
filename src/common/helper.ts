import * as jimp from 'jimp';

export async function isExist(model: any, whereClause: any) {
    whereClause = { ...whereClause, deleted: null };
    return model.count({
        where: whereClause
    }).then(count => {
        if (count == 0) {
            return false;
        }
        return true;
    }).catch(error => {
        return error;
    });
};

export async function chunkData(chunkSize: number = 500, array: any[]) {
    var chunks: any[] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function resizeImage(data: Buffer, size: number, quality: number) {
    return jimp.read(data)
        .then(async (image) => {
            return image
                .resize(size, size)
                .quality(quality);
        })
        .catch(error => {
            return error;
        })
}