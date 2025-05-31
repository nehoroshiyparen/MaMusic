import { Sequelize } from "sequelize";
import sequelize from "src/config/db/config/sequelize";
import { s3 } from "src/config/S3/s3.client";
import { UploadController } from "src/controllers/upload.controller";
import { MusicService } from "src/services/upload.service";
import { S3Service } from "src/services/S3.service";
import dotenv from 'dotenv'
import { TrackService } from "src/services/tracks.service";
import { TrackController } from "src/controllers/track.controller";

dotenv.config()

export class Container {
    private _sequelize: Sequelize;

    private _uploadService: MusicService;
    private _s3Service: S3Service;
    private _trackService: TrackService;
;
    private _uploadController: UploadController;
    private _trackController: TrackController;

    constructor() {
        this._sequelize = sequelize

        this._s3Service = new S3Service(s3, process.env.S3_BUCKET_NAME!)
        this._uploadService = new MusicService(this._sequelize, this._s3Service)
        this._trackService = new TrackService()

        this._uploadController = new UploadController(this._uploadService)
        this._trackController = new TrackController(this._trackService)
    }

    
    getUploadController() { return this._uploadController }
    getTrackController() { return this._trackController }
}