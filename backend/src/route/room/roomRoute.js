import express from "express";
import { roomController } from "../../controller/room/RoomController.js";

const router = express.Router();

// Room management routes
router.post("/property/:propertyId/rooms", roomController.createRoom);
router.get("/property/:propertyId/rooms", roomController.getRoomsByProperty);
router.put("/rooms/:roomId", roomController.updateRoom);
router.delete("/rooms/:roomId", roomController.deleteRoom);

export { router as roomRouter };
