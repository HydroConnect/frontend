// Sync with BE
interface iPanduanData {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    steps: string[];
}

const panduanDataSample: iPanduanData = {
    title: "Cara Menyalakan Pompa",
    videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    steps: ["Lorem", "Ipsum"],
};

export { panduanDataSample };
export type { iPanduanData };
