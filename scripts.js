document.addEventListener('DOMContentLoaded', () => {
    const contentDiv = document.getElementById('content');
    const listSurahsButton = document.getElementById('list-surahs');

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
            ayahItem.onclick = () => displayAyah(ayah);
            contentDiv.appendChild(ayahItem);
        });

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Surah List';
        backButton.onclick = () => fetchSurahs();
        contentDiv.appendChild(backButton);
    }

    // Function to display specific Ayah
    function displayAyah(ayah) {
        contentDiv.innerHTML = '';
        const ayahTitle = document.createElement('h2');
        ayahTitle.textContent = `Ayah ${ayah.numberInSurah}`;
        contentDiv.appendChild(ayahTitle);

        const ayahText = document.createElement('p');
        ayahText.textContent = ayah.text;
        contentDiv.appendChild(ayahText);

        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Surah';
        backButton.onclick = () => fetchSurahContent(ayah.surah.number);
        contentDiv.appendChild(backButton);
    }

    // Event listener for the "List All Surahs" button
    listSurahsButton.onclick = fetchSurahs;
});