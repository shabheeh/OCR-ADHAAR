import { Router } from "express";
import { container } from "../../configs/inversify.config";
import { IAdhaarController } from "../controllers/adhaar.controller.interface";
import TYPES from "../../shared/types/inversifyjs.types";
import upload from "../../configs/multer.config";

const router = Router();

const controller = container.get<IAdhaarController>(TYPES.AdhaarController);

router.post(
  "/adhaars",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  controller.processAdhaar
);

router.get("/adhaars/:systemId", controller.getPreviousRecords);

export default router;
