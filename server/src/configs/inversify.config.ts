import { Container } from "inversify";
import { Model } from "mongoose";
import { IAdhaar } from "../core/domain/adhaar.entity.interface";
import TYPES from "../shared/types/inversifyjs.types";
import { AdhaarModel } from "../core/domain/adhaar.entity";
import { IAdhaarRepository } from "../core/infrastructure/adhaar.repository.interface";
import { AdhaarRepository } from "../core/infrastructure/adhaar.repository";
import { IAdhaarService } from "../core/application/adhaar.service.interface";
import { AdhaarService } from "../core/application/adhaar.service";
import { IAdhaarController } from "../interfaces/controllers/adhaar.controller.interface";
import { AdhaarController } from "../interfaces/controllers/adhaar.controller";

export const container = new Container();

container.bind<Model<IAdhaar>>(TYPES.AdhaarModel).toConstantValue(AdhaarModel);
container.bind<IAdhaarRepository>(TYPES.AdhaarRepository).to(AdhaarRepository);
container.bind<IAdhaarService>(TYPES.AdhaarService).to(AdhaarService);
container.bind<IAdhaarController>(TYPES.AdhaarController).to(AdhaarController);
