#!/usr/bin/env node

/**
 * Health check script for Docker containers
 */

async function healthCheck(): Promise<void> {
  try {
    // Basic health check - just verify the main module can be imported
    const { TozYapiUpdated } = await import('./index.js');
    
    const app = new TozYapiUpdated();
    
    // Basic functionality check
    if (typeof app.createProject === 'function') {
      console.log('Health check passed');
      process.exit(0);
    } else {
      throw new Error('Main functionality not available');
    }
    
  } catch (error) {
    console.error('Health check failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run health check
healthCheck();