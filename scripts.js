document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const listSurahsButton = document.getElementById('list-surahs');
    const audioPlayer = document.getElementById('audio-player');

    let surahs = [];

    // Function to fetch all Surahs
    async function fetchSurahs() {
        try {
            const response = await fetch('http://api.alquran.cloud/v1/surah');
            const data = await response.json();
            surahs = data.data;
            displaySurahs(surahs);
        } catch (error) {
            console.error('Error fetching Surahs:', error);
        }
    }

    // Function to display list of Surahs
    function displaySurahs(surahs) {
        contentDiv.innerHTML = '';
        surahs.forEach(surah => {
            const surahItem = document.createElement('div');
            surahItem.className = 'surah-item';
            surahItem.textContent = `${surah.number}. ${surah.englishName} - ${surah.name}`;
            surahItem.onclick = () => fetchSurahContent(surah.number);
            contentDiv.appendChild(surahItem);
        });
    }

    // Function to fetch specific Surah content
    async function fetchSurahContent(surahNumber) {
        try {
            const response = await fetch(`http://api.alquran.cloud/v1/surah/${surahNumber}`);
            const data = await response.json();
            const surah = data.data;
            displaySurahContent(surah);
        } catch (error) {
            console.error('Error fetching Surah content:', error);
        }
    }

    // Function to display Surah content
    function displaySurahContent(surah) {
        contentDiv.innerHTML = '';
        const surahTitle = document.createElement('h2');
        surahTitle.textContent = `${surah.name} (${surah.englishName})`;
        contentDiv.appendChild(surahTitle);

        surah.ayahs.forEach(ayah => {
            const ayahItem = document.createElement('p');
            ayahItem.className = 'ayah-item';
            ayahItem.textContent = `${ayah.numberInSurah}: ${ayah.text}`;
            ayahItem.onclick = () => fetchAndPlayAyahAudio(surah.number, ayah.numberInSurah);
            contentDiv.appendChild(ayahItem);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Surah List';
        backButton.onclick = () => fetchSurahs();
        contentDiv.appendChild(backButton);

        const playSurahButton = document.createElement('button');
        playSurahButton.textContent = 'Play Full Surah';
        playSurahButton.onclick = () => fetchAndPlaySurahAudio(surah.number);
        contentDiv.appendChild(playSurahButton);
    }

    // Function to fetch and play specific Ayah audio
    async function fetchAndPlayAyahAudio(surahNumber, ayahNumber) {
        try {
            const response = await fetch(`http://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`);
            const data = await response.json();
            const ayah = data.data;

            if (ayah.audio && ayah.audio.primary) {
                audioPlayer.src = ayah.audio.primary;
                audioPlayer.play();
            }
        } catch (error) {
            console.error('Error fetching Ayah audio:', error);
        }
    }

    // Function to fetch and play full Surah audio
    async function fetchAndPlaySurahAudio(surahNumber) {
        try {
            const response = await fetch(`http://api.quran.com/api/v4/chapter_recitations/7/${surahNumber}`);
            const data = await response.json();

            if (data.audio_file) {
                audioPlayer.src = data.audio_file.url;
                audioPlayer.play();
            } else {
                console.error('No audio file found for Surah');
            }
        } catch (error) {
            console.error('Error fetching Surah audio:', error);
        }
    }

    // Event listener for the "List All Surahs" button
    listSurahsButton.onclick = fetchSurahs;
});