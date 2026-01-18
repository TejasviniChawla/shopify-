/**
 * ElevenLabs Service
 * Handles text-to-speech for voice briefings
 */

const axios = require('axios');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.elevenlabs.io/v1';

    // Default voice: Rachel (professional, clear)
    this.defaultVoiceId = 'EXAVITQu4vr4xnSDxMaL';

    // Voice options for different use cases
    this.voices = {
      professional: 'EXAVITQu4vr4xnSDxMaL', // Rachel
      friendly: '21m00Tcm4TlvDq8ikWAM',     // Rachel
      authoritative: 'VR6AewLTigWG4xSOukaG' // Arnold
    };
  }

  /**
   * Convert text to speech
   * @param {string} text - Text to convert
   * @param {string} voiceId - Optional voice ID
   * @returns {Promise<string>} Audio URL (data URL or CDN URL)
   */
  async textToSpeech(text, voiceId) {
    const voice = voiceId || this.defaultVoiceId;

    try {
      // Use mock audio if no API key configured
      if (!this.apiKey || this.apiKey === 'your_elevenlabs_key_here') {
        console.log('ElevenLabs: Using mock audio (no API key configured)');
        return this.getMockAudioUrl();
      }

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voice}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer',
          timeout: 60000
        }
      );

      // Convert to base64 data URL
      // In production, upload to S3/CDN instead
      const base64Audio = Buffer.from(response.data).toString('base64');
      return `data:audio/mpeg;base64,${base64Audio}`;

    } catch (error) {
      console.error('ElevenLabs API error:', error.message);
      return this.getMockAudioUrl();
    }
  }

  /**
   * Get available voices
   * @returns {Promise<Array>} List of available voices
   */
  async getVoices() {
    if (!this.apiKey || this.apiKey === 'your_elevenlabs_key_here') {
      return this.getMockVoices();
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        },
        timeout: 10000
      });

      return response.data.voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description
      }));

    } catch (error) {
      console.error('ElevenLabs voices error:', error.message);
      return this.getMockVoices();
    }
  }

  /**
   * Generate speech with streaming (for longer content)
   * @param {string} text - Text to convert
   * @param {string} voiceId - Voice ID
   * @returns {Promise<ReadableStream>} Audio stream
   */
  async textToSpeechStream(text, voiceId) {
    const voice = voiceId || this.defaultVoiceId;

    if (!this.apiKey || this.apiKey === 'your_elevenlabs_key_here') {
      throw new Error('Streaming requires valid API key');
    }

    const response = await axios.post(
      `${this.baseUrl}/text-to-speech/${voice}/stream`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'stream',
        timeout: 120000
      }
    );

    return response.data;
  }

  /**
   * Check API quota/usage
   * @returns {Promise<Object>} Usage information
   */
  async getUsage() {
    if (!this.apiKey || this.apiKey === 'your_elevenlabs_key_here') {
      return {
        characterCount: 0,
        characterLimit: 10000,
        canMakeRequest: false
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey
        },
        timeout: 10000
      });

      return {
        characterCount: response.data.character_count,
        characterLimit: response.data.character_limit,
        canMakeRequest: response.data.can_make_requests,
        tier: response.data.tier
      };

    } catch (error) {
      console.error('ElevenLabs usage error:', error.message);
      return {
        characterCount: 0,
        characterLimit: 0,
        canMakeRequest: false
      };
    }
  }

  /**
   * Get mock audio URL for demo
   * Returns a silent MP3 or placeholder audio
   */
  getMockAudioUrl() {
    // This is a very short silent MP3
    // In a real demo, you might host actual sample audio
    return 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/////////////////////////////////' +
           '////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
           'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
           'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQ' +
           'xAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tQxBgDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
  }

  /**
   * Get mock voices list
   */
  getMockVoices() {
    return [
      {
        id: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Rachel',
        category: 'professional',
        description: 'Clear, professional American female voice'
      },
      {
        id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Sam',
        category: 'friendly',
        description: 'Warm, friendly American male voice'
      },
      {
        id: 'VR6AewLTigWG4xSOukaG',
        name: 'Arnold',
        category: 'authoritative',
        description: 'Deep, authoritative male voice'
      }
    ];
  }
}

module.exports = ElevenLabsService;
