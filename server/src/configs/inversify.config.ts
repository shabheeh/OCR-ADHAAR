import { Container } from "inversify";
import { Model } from "mongoose";
import { IAdhaar } from "../models/adhaar/adhaar.entity.interface";
import TYPES from "../shared/types/inversifyjs.types";
import { AdhaarModel } from "../models/adhaar/adhaar.entity";
import { IAdhaarRepository } from "../repositories/adhaar.repository.interface";
import { AdhaarRepository } from "../repositories/adhaar.repository";
import { IAdhaarService } from "../services/adhaar.service.interface";
import { AdhaarService } from "../services/adhaar.service";
import { IAdhaarController } from "../controllers/adhaar.controller.interface";
import { AdhaarController } from "../controllers/adhaar.controller";

export const container = new Container();

container.bind<Model<IAdhaar>>(TYPES.AdhaarModel).toConstantValue(AdhaarModel);
container.bind<IAdhaarRepository>(TYPES.AdhaarRepository).to(AdhaarRepository);
container.bind<IAdhaarService>(TYPES.AdhaarService).to(AdhaarService);
container.bind<IAdhaarController>(TYPES.AdhaarController).to(AdhaarController);
