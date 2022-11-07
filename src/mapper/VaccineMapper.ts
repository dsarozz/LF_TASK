export class VaccineMapper {
    async ModelToDTO(model: any) {
        let dto: any = {};
        if (model) {
            dto.id = model.id;
            dto.name = model.name;
            dto.description = model.description;
            dto.dosage = model.dosage;
            dto.image = model.image;
        }
        return dto;
    };

    async ModelsToDTOs(models: any) {
        return models.map(model => {
            return {
                id: model.id,
                name: model.name,
                description: model.description,
                dosage: model.dosage,
                image: model.image
            }
        })
    };

    async DTOToModel(dto: any) {
        let model: any = {};
        if (dto) {
            model.id = dto.id;
            model.name = dto.name;
            model.description = dto.description;
            model.dosage = dto.dosage;
            model.image = dto.image;
        }
        return model;
    }
}