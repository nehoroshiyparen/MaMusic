import { Sequelize } from "sequelize"

export const mockSequelize = {} as unknown as Sequelize

export const mockAssertions = {
    ensurePlaylistExists: jest.fn(),
    ensureUserCanEdit: jest.fn(),
}

export const mockTrackService = {
    fetchTrack: jest.fn(),
}

export const mockPlaylistRepository = {
    getMaxOrder: jest.fn(),
    addTrack: jest.fn(),
}