import { Sequelize } from 'sequelize'
import { PlaylistService } from '../../src/services/playlist.service'
import { ApiError } from 'shared/common/utils/ApiError/api-error'
import { mockTrackService, mockPlaylistRepository, mockAssertions, mockSequelize } from './__mocks__/playlist.mocks'

describe('PlaylistService', () => {
    let service: PlaylistService

    beforeEach(() => {
        service = new PlaylistService(
            mockSequelize,
            mockAssertions as any,
            mockPlaylistRepository as any,
            mockTrackService as any
        )
    })

    it('should add a track to playlist', async () => {
        mockAssertions.ensurePlaylistExists.mockResolvedValue({ id: 1, user_id: 10 })
        mockTrackService.fetchTrack.mockResolvedValue({ id: 2 })
        mockPlaylistRepository.getMaxOrder.mockResolvedValue(3)
        mockPlaylistRepository.addTrack.mockResolvedValue(undefined)

        const result = await service.addTrackToPlaylist(1, 2, 10)

        expect(result).toEqual({ success: true })
        expect(mockPlaylistRepository.addTrack).toHaveBeenCalledWith(1, 2, 3)
    })

    it('should throw if track not found', async () => {
        mockAssertions.ensurePlaylistExists.mockResolvedValue({ id: 1, user_id: 10 })
        mockTrackService.fetchTrack.mockResolvedValue(null)

        await expect(service.addTrackToPlaylist(1, 2, 10)).rejects.toThrow(ApiError)
    })

    it('should throw if playlist does not exist', async () => {
    mockAssertions.ensurePlaylistExists.mockRejectedValue(ApiError.NotFound())
    
    await expect(service.addTrackToPlaylist(1, 2, 10)).rejects.toThrow(ApiError)
    })

})