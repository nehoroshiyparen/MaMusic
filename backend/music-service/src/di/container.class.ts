import { Sequelize } from "sequelize";
import sequelize from "src/config/db/config/sequelize";
import { s3 } from "src/config/S3/s3.client";
import { UploadController } from "src/controllers/upload.controller";
import { UploadService } from "src/services/upload.service";
import { S3Service } from "src/services/S3.service";
import dotenv from 'dotenv'
import { TrackService } from "src/services/tracks.service";
import { TrackController } from "src/controllers/track.controller";
import { GenreAssertions } from "src/assertions/genre.assertions";
import { PlaylistAssertions } from "src/assertions/playlist.assertions";
import { TrackAssertions } from "src/assertions/track.assertions";
import { GenreRepository } from "src/repositories/genre.repository";
import { PlaylistRepository } from "src/repositories/playlist.repository";
import { TrackRepository } from "src/repositories/track.repository";
import { TrackMetaService } from "src/services/trackMeta.service";
import { PlaylistService } from "src/services/playlist.service";
import { GenreService } from "src/services/genre.service";
import { PlaylistController } from "src/controllers/playlist.controller";

dotenv.config()

export class Container {
    private _sequelize: Sequelize;

    private _genreRepository: GenreRepository;
    private _playlistRepository: PlaylistRepository;
    private _trackRepository: TrackRepository;

    private _genreAssertions: GenreAssertions;
    private _playlistAssertions: PlaylistAssertions;
    private _trackAssertions: TrackAssertions;

    private _s3Service: S3Service;
    private _genreService: GenreService;
    private _trackService: TrackService;
    private _trackMetaService: TrackMetaService;
    private _playlistService: PlaylistService;
    private _uploadService: UploadService;

    private _uploadController: UploadController;
    private _playlistController: PlaylistController;
    private _trackController: TrackController;

    constructor() {
        this._sequelize = sequelize

        this._genreRepository = new GenreRepository()
        this._playlistRepository = new PlaylistRepository()
        this._trackRepository = new TrackRepository

        this._genreAssertions = new GenreAssertions()
        this._playlistAssertions = new PlaylistAssertions(this._sequelize, this._playlistRepository)
        this._trackAssertions = new TrackAssertions(this._sequelize)

        this._s3Service = new S3Service(s3, process.env.S3_BUCKET_NAME!)
        this._trackService = new TrackService(this._sequelize, this._trackRepository, this._trackAssertions)
        this._trackMetaService = new TrackMetaService()
        this._genreService = new GenreService(this._genreRepository, this._genreAssertions)
        this._playlistService = new PlaylistService(this._sequelize, this._playlistAssertions, this._playlistRepository, this._trackService)
        this._uploadService = new UploadService(this._sequelize, this._s3Service, this._trackService, this._trackMetaService, this._genreService)

        this._uploadController = new UploadController(this._uploadService)
        this._playlistController = new PlaylistController(this._playlistService)
        this._trackController = new TrackController(this._trackService)
    }

    
    getUploadController() { return this._uploadController }
    getPlaylistController() { return this._playlistController }
    getTrackController() { return this._trackController }
}