import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Send, RotateCcw, Landmark, Moon, Move3d } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';
import { CameraPreset } from '../App';

interface UIOverlayProps {
  isFloating: boolean;
  wishText: string;
  setWishText: (val: string) => void;
  onRelease: () => void;
  onReset: () => void;
  isInspectMode: boolean;
  setIsInspectMode: (val: boolean) => void;
  cameraPreset: CameraPreset;
  setCameraPreset: (val: CameraPreset) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  isFloating,
  wishText,
  setWishText,
  onRelease,
  onReset,
  isInspectMode,
  setIsInspectMode,
  cameraPreset,
  setCameraPreset
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    const playing = audioSystem.toggle();
    setIsPlayingAudio(playing);
  };

  const wishPresets = [
    'ขอขมาพระแม่คงคา ลอยทุกข์โศกโรคภัย',
    'ขอให้ชีวิตร่มเย็น มีความสุขความเจริญ',
    'ขอให้สมหวังในความรัก และพบเจอแต่สิ่งดีงาม'
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {/* Top Header Bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, rgba(3,7,18,0.85), transparent)',
          pointerEvents: 'auto'
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Charm', cursive",
              fontSize: '28px',
              fontWeight: 700,
              color: '#fef08a',
              letterSpacing: '0.04em',
              textShadow: '0 2px 14px rgba(245,158,11,0.6)'
            }}
          >
            ท่าน้ำวัดอรุณ • คืนลอยกระทง
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: '#9ca3af',
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}
          >
            สายธารเจ้าพระยา • ศาลาท่าน้ำและพระปรางค์ประดับไฟ
          </p>
        </div>

        {/* Top Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '24px',
              background: isPlayingAudio ? 'rgba(245,158,11,0.22)' : 'rgba(15,23,42,0.7)',
              border: `1px solid ${isPlayingAudio ? '#f59e0b' : 'rgba(255,255,255,0.12)'}`,
              color: isPlayingAudio ? '#fef08a' : '#d1d5db',
              cursor: 'pointer',
              fontSize: '13px',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease'
            }}
          >
            {isPlayingAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isPlayingAudio ? 'เสียงสายน้ำ & ขิม' : 'เปิดเสียงบรรยากาศ'}</span>
          </button>

          {/* Reset / Craft New Button */}
          {isFloating && (
            <button
              onClick={onReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '24px',
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid #f59e0b',
                color: '#fef08a',
                cursor: 'pointer',
                fontSize: '13px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.25s ease'
              }}
            >
              <RotateCcw size={16} />
              <span>พับกระทงใหม่</span>
            </button>
          )}
        </div>
      </header>

      {/* Camera View Switcher (มุมมองกล้องอิสระ) */}
      <div
        style={{
          position: 'absolute',
          top: '84px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          background: 'rgba(3,7,18,0.75)',
          padding: '6px 10px',
          borderRadius: '30px',
          border: '1px solid rgba(245,158,11,0.3)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}
      >
        <button
          onClick={() => setCameraPreset('krathong')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            border: 'none',
            background: cameraPreset === 'krathong' ? '#f59e0b' : 'transparent',
            color: cameraPreset === 'krathong' ? '#0f172a' : '#d1d5db',
            fontWeight: cameraPreset === 'krathong' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span>🪷 มุมกระทง</span>
        </button>

        <button
          onClick={() => setCameraPreset('temple')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            border: 'none',
            background: cameraPreset === 'temple' ? '#f59e0b' : 'transparent',
            color: cameraPreset === 'temple' ? '#0f172a' : '#d1d5db',
            fontWeight: cameraPreset === 'temple' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Landmark size={13} />
          <span>ท่าน้ำ & พระปรางค์วัด</span>
        </button>

        <button
          onClick={() => setCameraPreset('sky')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            border: 'none',
            background: cameraPreset === 'sky' ? '#f59e0b' : 'transparent',
            color: cameraPreset === 'sky' ? '#0f172a' : '#d1d5db',
            fontWeight: cameraPreset === 'sky' ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Moon size={13} />
          <span>ท้องฟ้า & จันทร์เพ็ญ</span>
        </button>

        <button
          onClick={() => setCameraPreset('free')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            border: 'none',
            background: cameraPreset === 'free' ? 'rgba(245,158,11,0.25)' : 'transparent',
            color: cameraPreset === 'free' ? '#fef08a' : '#9ca3af',
            borderWidth: cameraPreset === 'free' ? '1px' : '0px',
            borderColor: '#f59e0b',
            fontWeight: cameraPreset === 'free' ? 500 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Move3d size={13} />
          <span>มุมมองอิสระ 360°</span>
        </button>
      </div>

      {/* Floating Status / Hint when released */}
      {isFloating && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            background: 'rgba(3,7,18,0.8)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '20px',
            padding: '12px 28px',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ color: '#fef08a', fontSize: '15px', fontWeight: 500 }}>
            กระทงของคุณกำลังลอยผ่านหน้าวัดและพระปรางค์ลงสู่สายธาร...
          </div>
          {wishText && (
            <div style={{ color: '#cbd5e1', fontSize: '13px', fontStyle: 'italic', marginTop: '3px' }}>
              "{wishText}"
            </div>
          )}
          <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '6px' }}>
            🖱️ ลากเมาส์เพื่อหมุนกล้องชมวัด ท้องฟ้า หรือกระทงได้ 360° อย่างอิสระ
          </div>
        </div>
      )}

      {/* Crafting & Wishing Drawer (Before release) */}
      {!isFloating && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            maxWidth: '540px',
            background: 'rgba(3,7,18,0.88)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(245,158,11,0.35)',
            boxShadow: '0 16px 36px -8px rgba(0,0,0,0.85)',
            borderRadius: '24px',
            padding: '22px 24px',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#f59e0b" />
              <span style={{ fontSize: '14px', color: '#fef3c7', fontWeight: 500 }}>
                เขียนคำอธิษฐานลงในกระทง ณ ท่าน้ำวัด
              </span>
            </div>

            <button
              onClick={() => setIsInspectMode(!isInspectMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isInspectMode ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isInspectMode ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                color: isInspectMode ? '#fef08a' : '#9ca3af',
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '14px',
                cursor: 'pointer'
              }}
            >
              <span>{isInspectMode ? 'หยุดหมุนอัตโนมัติ' : 'หมุนชมกระทงอัตโนมัติ'}</span>
            </button>
          </div>

          {/* Wish Input Box */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type="text"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="พิมพ์คำอธิษฐานของคุณ..."
              maxLength={80}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fef9c3',
                fontSize: '14px',
                outline: 'none',
                fontFamily: "'Prompt', sans-serif"
              }}
            />
          </div>

          {/* Wish Quick Presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {wishPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setWishText(preset)}
                style={{
                  fontSize: '11px',
                  padding: '5px 10px',
                  borderRadius: '12px',
                  background: wishText === preset ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${wishText === preset ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                  color: wishText === preset ? '#fef08a' : '#9ca3af',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Release Button */}
          <button
            onClick={() => {
              if (!isPlayingAudio) {
                toggleAudio();
              }
              onRelease();
            }}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              border: 'none',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px -4px rgba(245,158,11,0.5)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Send size={18} />
            <span>ลอยกระทงจากท่าน้ำวัดลงสู่สายน้ำ</span>
          </button>

          <p
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#94a3b8',
              marginTop: '10px'
            }}
          >
            💡 หมุนเมาส์ซ้าย = หมุนดูวัดและกระทง | คลิกขวา = แพนเลื่อนกล้อง | กลิ้งเมาส์ = ซูมเข้า-ออกได้ตามใจ
          </p>
        </div>
      )}
    </div>
  );
};
