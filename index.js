// QR Quick Menu v3
// 변경점: 패널을 #form_sheld(입력창 영역) 안에 붙이고 position:absolute 사용.
//         ST에서는 body에 transform이 걸려 position:fixed가 깨지기 때문.

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

    // 패널 위치/모양 — bottom 숫자만 바꾸면 위아래 조정됨
    const PANEL_STYLE = {
        display: 'none',
        position: 'absolute',
        left: '50%',
        bottom: '100%',
        marginBottom: '8px',
        transform: 'translateX(-50%)',
        zIndex: '99999',
        flexDirection: 'column',
        gap: '4px',
        background: 'var(--SmartThemeBlurTintColor, #fff)',
        border: '1px solid var(--SmartThemeBorderColor, #ccc)',
        borderRadius: '10px',
        padding: '8px',
        minWidth: '200px',
        maxHeight: '50vh',
        overflowY: 'auto',
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

    // 패널을 붙일 부모: 입력창 영역 우선, 없으면 body
    function getHost() {
        return document.getElementById('form_sheld')
            || document.getElementById('send_form')
            || document.body;
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

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(127,127,127,0.15)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'transparent';
            });

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

        const host = getHost();
        // 부모가 static이면 absolute 기준이 안 되므로 relative 보장
        if (host !== document.body && getComputedStyle(host).position === 'static') {
            host.style.position = 'relative';
        }
        host.appendChild(panelEl);
        console.log('[QR Quick Menu v3] 패널 부모:', host.id || host.tagName);
    }

    function buildTrigger() {
        triggerEl = document.createElement('div');
        triggerEl.id = TRIGGER_ID;
        applyStyle(triggerEl, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '1px',
            height: '1px',
        });
        triggerEl.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });
        getHost().appendChild(triggerEl);
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
        console.log('[QR Quick Menu v3] 준비 완료 — 트리거: #' + TRIGGER_ID);
    }

    // ST는 입력창을 늦게 그리므로 약간 지연 후 초기화
    function boot() {
        if (document.getElementById('form_sheld')) {
            init();
        } else {
            setTimeout(boot, 300);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
