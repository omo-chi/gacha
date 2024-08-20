let items = [];
let map;
const prefectures = ["兵庫県", "福井県", "島根県", "鳥取県", "山口県", "広島県", "大阪府", "岡山県", "京都府", "和歌山県", "滋賀県", "富山県", "三重県", "奈良県", "新潟県", "石川県", "長野県", "福岡県"];

// ページロード時に固定ファイルを読み込む
window.onload = function() {
    fetch('station.tsv')
        .then(response => response.text())
        .then(text => parseTSV(text));
};

function parseTSV(text) {
    const lines = text.split('\n');
    items = lines.slice(1).map(line => {
        const [station, reading, romaji, number, route, prefecture, city, lat, lon] = line.split('\t');
        return { station, reading, romaji, number, route, prefecture, city, lat, lon };
    });
    createCheckboxes();
}

function createCheckboxes() {
    const table = document.getElementById('prefecture-table');
    const rows = Math.ceil(prefectures.length / 3);

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            if (index < prefectures.length) {
                const pref = prefectures[index];
                const td = document.createElement('td');
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = pref;
                checkbox.checked = true;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(pref));
                td.appendChild(label);
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }
}

function drawGacha() {
    const selectedPrefectures = Array.from(document.querySelectorAll('#prefecture-checkboxes input:checked')).map(checkbox => checkbox.value);
    const filteredItems = items.filter(item => selectedPrefectures.includes(item.prefecture));
    
    if (filteredItems.length === 0) {
        alert("選択された都道府県にはデータがありません。");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    const selectedItem = filteredItems[randomIndex];
    
    document.getElementById('result1').textContent = `${selectedItem.prefecture}${selectedItem.city}`;
    document.getElementById('result2').textContent = `${selectedItem.reading}`;
    document.getElementById('result3').textContent = `${selectedItem.station} 駅`;
    document.getElementById('result4').textContent = `${selectedItem.route}`;
    
    document.getElementById('gacha-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    // 地図を初期化してピンを立てる
    initMap(selectedItem.lat, selectedItem.lon);
}

function backToGacha() {
    document.getElementById('gacha-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');

    // 地図インスタンスが存在する場合、地図を削除する
    if (map) {
        map.remove();
        map = null;
    }
}


function initMap(lat, lon) {
    if (map) {
        map.remove(); // 既存の地図インスタンスを削除
    }
    map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 7,
    }).addTo(map);
    L.marker([lat, lon]).addTo(map)
        .openPopup();
}