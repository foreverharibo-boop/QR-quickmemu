// QR Quick Menu
// 빠답(QR) 버튼 하나로 열고, 진짜 클릭이든 /dom으로 만든 가짜 클릭이든
// 절대 자동으로 닫히지 않는 작은 퀵메뉴 패널.
// - 각 버튼은 ST 코어의 실제 옵션 메뉴 항목(#option_xxx)을 대신 클릭해줌.
// - 패널 자체 바깥을 "진짜로" 클릭했을 때만 닫힘 (트리거/패널 안쪽 클릭은 무시).

(function () {
    const TRIGGER_ID = 'qr-quickmenu-trigger';
    const PANEL_ID = 'qr-quickmenu-panel';

    // 버튼 목록: [라벨, 대신 클릭해줄 실제 ST 요소 id]
    const ITEMS = [
        ['📝 작가 노트', 'option_toggle_AN'],
        ['💬 새로운 채팅 시작', 'option_start_new_chat'],
        ['✕ 채팅 닫기', 'option_close_chat'],
        ['📂 채팅 파일 관리', 'option_select_chat'],
    ];

    let panelEl = null;
    let triggerEl = null;

    function buildPanel() {
        panelEl = document.createElement('div');
        panelEl.id = PANEL_ID;
        panelEl.style.display = 'none';

        ITEMS.forEach(([label, targetId]) => {
            const btn = document.createElement('div');
            btn.className = 'qr-quickmenu-item';
            btn.textContent = label;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = document.getElementById(targetId);
                if (target) {
                    target.click();
                } else {
                    console.warn(`[QR Quick Menu] 대상 요소를 못 찾음: #${targetId}`);
                }
                closePanel();
            });
            panelEl.appendChild(btn);
        });

        document.documentElement.appendChild(panelEl);
    }

    function buildTrigger() {
        // 화면 밖으로 치워둠 (display:none 대신) - display:none이면
        // 일부 ST 클릭 핸들러가 :visible 체크에서 씹힐 수 있어서 이 방식을 씀.
        triggerEl = document.createElement('div');
        triggerEl.id = TRIGGER_ID;
        triggerEl.style.position = 'fixed';
        triggerEl.style.left = '-9999px';
        triggerEl.style.top = '0';
        triggerEl.style.width = '1px';
        triggerEl.style.height = '1px';
        triggerEl.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });
        document.documentElement.appendChild(triggerEl);
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

    // 패널/트리거 바깥을 "진짜로" 클릭했을 때만 닫음.
    // /dom action=click #qr-quickmenu-trigger 로 만든 클릭은
    // target이 트리거 자기 자신이라 아래 조건에 안 걸려서 안전함.
    document.addEventListener('click', (e) => {
        if (panelEl.style.display === 'none') return;
        const target = e.target;
        if (panelEl.contains(target) || triggerEl.contains(target)) return;
        closePanel();
    });

    function init() {
        buildPanel();
        buildTrigger();
        console.log('[QR Quick Menu] 준비 완료 — 트리거: #' + TRIGGER_ID);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
