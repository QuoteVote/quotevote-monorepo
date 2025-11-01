const { getLocalQuotes } = require('../../../data/resolvers/queries/qoute/getLocalQuotes');
const QuoteModel = require('../../../data/resolvers/models/QuoteModel');
const { calculateDistance } = require('../../../data/utils/geolocation');

jest.mock('../../../data/resolvers/models/QuoteModel');
jest.mock('../../../data/utils/geolocation');

describe('getLocalQuotes resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should query quotes near location with default radius', async () => {
    const mockQuotes = [
      {
        _id: 'quote1',
        quote: 'Test quote 1',
        isLocal: true,
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
        },
        placeLabel: 'San Francisco, CA',
      },
      {
        _id: 'quote2',
        quote: 'Test quote 2',
        isLocal: true,
        location: {
          type: 'Point',
          coordinates: [-122.4100, 37.7800],
        },
        placeLabel: 'San Francisco, CA',
      },
    ];

    QuoteModel.find = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockResolvedValue(mockQuotes),
      }),
    });

    calculateDistance.mockReturnValue(2.5);

    const result = await getLocalQuotes(null, {
      near: { latitude: 37.7749, longitude: -122.4194 },
      limit: 10,
      offset: 0,
    });

    expect(QuoteModel.find).toHaveBeenCalledWith({
      isLocal: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749],
          },
          $maxDistance: 10000, // 10 km in meters
        },
      },
    });

    expect(result).toHaveLength(2);
    expect(result[0].distanceFromUser).toBe(2.5);
  });

  it('should use custom radius', async () => {
    const mockQuotes = [];

    QuoteModel.find = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockResolvedValue(mockQuotes),
      }),
    });

    await getLocalQuotes(null, {
      near: { latitude: 37.7749, longitude: -122.4194 },
      radiusKm: 25,
      limit: 10,
      offset: 0,
    });

    expect(QuoteModel.find).toHaveBeenCalledWith({
      isLocal: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749],
          },
          $maxDistance: 25000, // 25 km in meters
        },
      },
    });
  });

  it('should apply limit and offset', async () => {
    const mockQuotes = [];

    const mockSkip = jest.fn().mockResolvedValue(mockQuotes);
    const mockLimit = jest.fn().mockReturnValue({ skip: mockSkip });
    QuoteModel.find = jest.fn().mockReturnValue({ limit: mockLimit });

    await getLocalQuotes(null, {
      near: { latitude: 37.7749, longitude: -122.4194 },
      limit: 20,
      offset: 10,
    });

    expect(mockLimit).toHaveBeenCalledWith(20);
    expect(mockSkip).toHaveBeenCalledWith(10);
  });

  it('should calculate distance for each quote', async () => {
    const mockQuotes = [
      {
        _id: 'quote1',
        location: {
          coordinates: [-122.4194, 37.7749],
        },
      },
      {
        _id: 'quote2',
        location: {
          coordinates: [-122.4100, 37.7800],
        },
      },
    ];

    QuoteModel.find = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockResolvedValue(mockQuotes),
      }),
    });

    calculateDistance
      .mockReturnValueOnce(2.5)
      .mockReturnValueOnce(3.8);

    const result = await getLocalQuotes(null, {
      near: { latitude: 37.7749, longitude: -122.4194 },
    });

    expect(calculateDistance).toHaveBeenCalledTimes(2);
    expect(result[0].distanceFromUser).toBe(2.5);
    expect(result[1].distanceFromUser).toBe(3.8);
  });

  it('should throw error for invalid coordinates', async () => {
    await expect(
      getLocalQuotes(null, {
        near: { latitude: 91, longitude: -122.4194 },
      })
    ).rejects.toThrow();
  });

  it('should return empty array when no quotes found', async () => {
    QuoteModel.find = jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        skip: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await getLocalQuotes(null, {
      near: { latitude: 37.7749, longitude: -122.4194 },
    });

    expect(result).toEqual([]);
  });
});
