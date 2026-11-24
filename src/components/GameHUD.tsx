import React, { useState, useEffect } from 'react';

interface GameHUDProps {
  showPrompt: boolean;
  krathongCount: number;
  onReleaseWithWish: (wishText: string) => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  showPrompt,
  krathongCount,
  onReleaseWithWish,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishText, setWishText] = useState('ขอขมาพระแม่คงคา ขอให้มีความสุขความเจริญ ร่ำรวยเงินทอง ไร้โรคภัย');

  // Quick wish presets
  const presets = [
    '💖 ขอให้ความรักสมหวัง มีความสุขสดใส',
    '💰 ขอให้ร่ำรวย โชคลาภเงินทองไหลมาเทมา',
    '🌿 ขอให้สุขภาพแข็งแรง อายุยืนยาว ปราศจากโรคภัย',
    '💼 ขอให้การงานก้าวหน้า ค้าขายร่ำรวย ประสบความสำเร็จ',
    '🌊 ขอขมาพระแม่คงคา ลอยทุกข์โศกโรคภัยลงสู่สายน้ำ',
  ];

  // Open modal when E is pressed near pier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if already typing in input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        if (e.key === 'Enter') {
          handleConfirm();
        } else if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
        return;
      }

      if (e.code === 'KeyE' && showPrompt && !isModalOpen) {
        setIsModalOpen(true);
      } else if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPrompt, isModalOpen, wishText]);

  const handleConfirm = () => {
    onReleaseWithWish(wishText.trim() || 'ขอขมาพระแม่คงคา');
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ── Title ── */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 24,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
            fontSize: '1.6rem',
            color: '#fde68a',
            textShadow: '0 2px 14px rgba(255,170,68,0.6)',
            margin: 0,
            fontWeight: 700,
          }}
        >
          🏮 ลอยกระทง Festival ริมสายน้ำ
        </h1>
        <p
          style={{
            fontFamily: "'Sarabun', sans-serif",
            fontSize: '0.88rem',
            color: '#cbd5e1',
            margin: '4px 0 0 0',
          }}
        >
          🖱️ ลากเมาส์หมุนกล้อง 360° รอบตัว • WASD เดิน • เดินลงบันไดไปลอยกระทง
        </p>
      </div>

      {/* ── Krathong counter ── */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          pointerEvents: 'none',
          zIndex: 10,
          background: 'rgba(15,23,42,0.65)',
          borderRadius: 12,
          padding: '8px 18px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(251,191,36,0.3)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <span
          style={{
            fontFamily: "'Sarabun', sans-serif",
            fontSize: '1.15rem',
            color: '#fde68a',
            fontWeight: 600,
          }}
        >
          🪷 กระทงที่ลอยแล้ว: {krathongCount}
        </span>
      </div>

      {/* ── Interaction Prompt (Near pier / stairs) ── */}
      {showPrompt && !isModalOpen && (
        <div
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'absolute',
            bottom: 75,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            background: 'linear-gradient(135deg, rgba(30,41,59,0.92) 0%, rgba(15,23,42,0.95) 100%)',
            borderRadius: 16,
            padding: '14px 32px',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(251,191,36,0.6)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.35)',
            cursor: 'pointer',
            animation: 'pulseGlow 2s ease-in-out infinite',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Sarabun', sans-serif",
              fontSize: '1.25rem',
              color: '#fef08a',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            กด{' '}
            <kbd
              style={{
                background: '#facc15',
                color: '#1a1a2e',
                padding: '3px 12px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 2px 0 #b45309',
              }}
            >
              E
            </kbd>{' '}
            หรือคลิกที่นี่ เพื่อเขียนคำอธิษฐาน & ลอยกระทง 🪷
          </span>
        </div>
      )}

      {/* ── Wish Text Input Modal ── */}
      {isModalOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            background: 'rgba(5, 10, 20, 0.72)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
              border: '2px solid rgba(251,191,36,0.55)',
              borderRadius: 20,
              padding: '28px 32px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(245,158,11,0.2)',
              color: '#f8fafc',
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.75rem',
                  color: '#fde68a',
                  textShadow: '0 2px 10px rgba(245,158,11,0.5)',
                  fontWeight: 700,
                }}
              >
                🪷 เขียนคำอธิษฐานลงกระทง 🪷
              </h2>
              <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.92rem' }}>
                ข้อความนี้จะลอยส่องแสงสีทองไปพร้อมกับกระทงของคุณบนสายน้ำ
              </p>
            </div>

            {/* Input field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: 6 }}>
                คำอธิษฐานของคุณ:
              </label>
              <input
                type="text"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                autoFocus
                placeholder="พิมพ์คำอธิษฐานที่นี่..."
                maxLength={60}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(15,23,42,0.85)',
                  border: '1.5px solid rgba(251,191,36,0.4)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  color: '#fef08a',
                  fontSize: '1.1rem',
                  outline: 'none',
                  fontFamily: "'Sarabun', sans-serif",
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                }}
              />
            </div>

            {/* Quick preset buttons */}
            <div style={{ marginBottom: 22 }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                หรือเลือกคำอธิษฐานสำเร็จรูป:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setWishText(p)}
                    type="button"
                    style={{
                      background: 'rgba(30,41,59,0.7)',
                      border: '1px solid rgba(251,191,36,0.25)',
                      borderRadius: 10,
                      padding: '6px 12px',
                      color: '#e2e8f0',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: "'Sarabun', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.2)';
                      e.currentTarget.style.borderColor = '#facc15';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(30,41,59,0.7)';
                      e.currentTarget.style.borderColor = 'rgba(251,191,36,0.25)';
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(51,65,85,0.7)',
                  border: '1px solid #475569',
                  borderRadius: 12,
                  padding: '12px 22px',
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontFamily: "'Sarabun', sans-serif",
                }}
              >
                ยกเลิก (Esc)
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 28px',
                  color: '#1a1a2e',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
                  fontFamily: "'Sarabun', sans-serif",
                }}
              >
                🪷 ลอยกระทงสู่สายน้ำ (Enter)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Controls help ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 24,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Sarabun', sans-serif",
            fontSize: '0.8rem',
            color: '#94a3b8',
          }}
        >
          🖱️ ลากเมาส์หมุนกล้อง 360° • 📜 เลื่อนล้อเมาส์ซูม • W↑ A← S↓ D→ เดิน • E ลอยกระทง
        </span>
      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 8px 32px rgba(245,158,11,0.35);
          }
          50% {
            transform: translateX(-50%) scale(1.03);
            box-shadow: 0 12px 40px rgba(245,158,11,0.6);
          }
        }
      `}</style>
    </>
  );
};
