// QR Quick Menu v2
// CSS 파일에 의존하지 않고 JS가 인라인 스타일을 직접 박아넣는 버전.
// 빠답(QR) 버튼 하나로 열고, /dom으로 만든 가짜 클릭에도 절대 자동으로 닫히지 않음.

(function () {
    const TRIGGER_ID = 'qr-quickmenu-trigger';
    const PANEL_ID = 'qr-quickmenu-panel';

    // [라벨, 대신 클릭해줄 실제 ST 요소 id]
    const ITEMS = [
        ['📝 작가 노트', 'option_toggle_AN'],
        ['💬 새로운 채팅 시작', 'option_start_new_chat'],
        ['✕ 채팅 닫기', 'option_close_chat'],
        ['📂 채팅 파일 관리', 'option_select_chat'],
    ];

    // 패널 위치/모양 — 여기 숫자만 바꾸면 위치 조정됨
    const PANEL_STYLE = {
        display: 'none',
        position: 'fixed',
        left: '50%',
        bottom: '70px',
        transform: 'translateX(-50%)',
        zIndex: '99999',
        flexDirection: 'column',
        gap: '4px',
        background: 'var(--SmartThemeBlurTintColor, #fff)',
        border: '1px solid var(--SmartThemeBorderColor, #ccc)',
        borderRadius: '10px',
        padding: '8px',
        minWidth: '200px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
    };

    const ITEM_STYLE = {
        padding: '10px 14px',
        borderRadius: '6px',
        color: 'var(--SmartThemeBodyColor, #333)',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        textShadow: 'none',
        userSelect: 'none',
    };

    let panelEl = null;
    let triggerEl = null;

    function applyStyle(el, styleObj) {
        Object.keys(styleObj).forEach((key) => {
            el.style[key] = styleObj[key];
        });
    }

    function buildPanel() {
        panelEl = document.createElement('div');
        panelEl.id = PANEL_ID;
        applyStyle(panelEl, PANEL_STYLE);

        ITEMS.forEach(([label, targetId]) => {
            const btn = document.createElement('div');
            btn.className = 'qr-quickmenu-item';
            btn.textContent = label;
            applyStyle(btn, ITEM_STYLE);

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = document.getElementById(targetId);
                if (target) {
                    target.click();
                } else {
                    console.warn(`[QR Quick Menu] 대상을 못 찾음: #${targetId}`);
                }
                closePanel();
            });

            panelEl.appendChild(btn);
        });

        document.body.appendChild(panelEl);
    }

    function buildTrigger() {
        // 화면 밖으로 치워둠 (display:none이면 일부 클릭 핸들러가 씹힐 수 있어서)
        triggerEl = document.createElement('div');
        triggerEl.id = TRIGGER_ID;
        applyStyle(triggerEl, {
            position: 'fixed',
            left: '-9999px',
            top: '0',
            width: '1px',
            height: '1px',
        });
        triggerEl.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });
        document.body.appendChild(triggerEl);
    }

    function openPanel() {
        panelEl.style.display = 'flex';
    }

    function closePanel() {
        panelEl.style.display = 'none';
    }

    function togglePanel() {
        if (panelEl.style.display === 'none') {
            openPanel();
        } else {
            closePanel();
        }
    }

    // 패널/트리거 바깥을 진짜로 클릭했을 때만 닫음
    document.addEventListener('click', (e) => {
        if (!panelEl || panelEl.style.display === 'none') return;
        if (panelEl.contains(e.target) || triggerEl.contains(e.target)) return;
        closePanel();
    });

    function init() {
        buildPanel();
        buildTrigger();
        console.log('[QR Quick Menu v2] 준비 완료 — 트리거: #' + TRIGGER_ID);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
