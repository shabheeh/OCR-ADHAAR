import { Router } from "express";
import { container } from "../../configs/inversify.config";
import { IAdhaarController } from "../controllers/adhaar.controller.interface";
import TYPES from "../../shared/types/inversifyjs.types";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

const controller = container.get<IAdhaarController>(TYPES.AdhaarController);

router.post(
  "/adhaar",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  controller.processAdhaar
);

export default router;
