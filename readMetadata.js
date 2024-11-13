const fs = require("fs");
const path = require("path");

const BASE_URL = 'https://coral-junior-magpie-341.mypinata.cloud/ipfs/QmUzUTUrM96Ryn9UmAwYxnNFKeD2oajM6tTMwkRNan7GLu/';


const counterFile = (dir, ext) => {
    const metadata = fs.readdirSync("./metadata");
    const counter = metadata.filter(file => file.endsWith(ext)).length
    
    return counter;
}

function updateMetadataFile(filePath, fileNumber) {
    try {
        // Read the metadata file
        const data = fs.readFileSync(filePath, 'utf8');
        const metadata = JSON.parse(data);

        // Update the image URL
        metadata.image = `${BASE_URL}${fileNumber}.png`;
        
        // Update the properties.files[0].uri if it exists
        if (metadata.properties && metadata.properties.files && metadata.properties.files.length > 0) {
            metadata.properties.files[0].uri = `${fileNumber}.png`;
        }

        // Write the updated metadata back to file
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
        console.log(`Updated metadata for file ${fileNumber}`);
    } catch (error) {
        console.error(`Error processing file ${fileNumber}:`, error);
    }
}


const updateMetadata = (dir) => {
    if (!fs.existsSync(dir)) {
        console.error('Directory does not exist:', dir);
        return;
    }

    const meta = counterFile("./metadata", ".json")
    if (meta != 500) {
        console.log(`Expected 500 files, got ${meta}`);
        return;
    }

    for (let i = 1; i <= meta; i++) {
        const filePath = path.join(dir, `${i}.json`);
        if (fs.existsSync(filePath)) {
            updateMetadataFile(filePath, i);
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    }
}

updateMetadata("./metadata");