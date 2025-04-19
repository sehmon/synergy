import { PrismaClient } from '@prisma/client';
import { PlayerPositionData } from '@synergy/shared';
import { Vector3 } from 'three';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Service for managing player trail data in the database
 */
export class TrailService {
  /**
   * Save a player trail to the database
   */
  static async saveTrail(data: PlayerPositionData): Promise<string> {
    try {
      // Extract user info and positions
      const { userInfo, positionHistory } = data;
      
      // Create the player trail record
      const trail = await prisma.playerTrail.create({
        data: {
          userId: userInfo?.id || 'anonymous',
          metadata: userInfo ? JSON.stringify(userInfo) : null,
          positions: {
            create: positionHistory.map((pos, index) => ({
              x: pos.x,
              y: pos.y,
              z: pos.z,
              order: index
            }))
          }
        }
      });
      
      return trail.id;
    } catch (error) {
      console.error('Failed to save trail to database:', error);
      throw error;
    }
  }
  
  /**
   * Get all player trails from the database
   */
  static async getAllTrails(limit = 50): Promise<PlayerPositionData[]> {
    try {
      const trails = await prisma.playerTrail.findMany({
        orderBy: {
          timestamp: 'desc'
        },
        take: limit,
        include: {
          positions: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
      
      // Convert to PlayerPositionData format
      return trails.map(trail => {
        let userInfo;
        try {
          userInfo = trail.metadata ? JSON.parse(trail.metadata) : {};
          // Add timestamp if not present
          userInfo.timestamp = userInfo.timestamp || trail.timestamp.toISOString();
          userInfo.id = userInfo.id || trail.userId;
          // Add trailId for deletion
          userInfo.trailId = trail.id;
        } catch (e) {
          userInfo = {
            id: trail.userId,
            timestamp: trail.timestamp.toISOString(),
            trailId: trail.id
          };
        }
        
        return {
          userInfo,
          positionHistory: trail.positions.map(pos => 
            new Vector3(pos.x, pos.y, pos.z)
          )
        };
      });
    } catch (error) {
      console.error('Failed to fetch trails from database:', error);
      return [];
    }
  }
  
  /**
   * Delete all player trails from the database
   */
  static async clearAllTrails(): Promise<number> {
    try {
      const result = await prisma.playerTrail.deleteMany({});
      return result.count;
    } catch (error) {
      console.error('Failed to clear trails from database:', error);
      throw error;
    }
  }
  
  /**
   * Delete a specific player trail from the database
   */
  static async deleteTrail(id: string): Promise<boolean> {
    try {
      await prisma.playerTrail.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete trail ${id}:`, error);
      return false;
    }
  }
}