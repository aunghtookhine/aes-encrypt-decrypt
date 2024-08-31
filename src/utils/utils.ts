import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import mammoth from "mammoth";

export const extractContent = async (file: File) => {
  const fileType = file.type;
  let fileContent = "";
  if (fileType === "text/plain") {
    fileContent = await file.text();
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    fileContent = await extractTextFromDocx(file);
  }
  return fileContent;
};

const extractTextFromDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
  } catch (error) {
    console.error("Error extracting text from .docx file:", error);
    throw error;
  }
};

export const downloadDocx = (encryptedText: string, fileName: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: encryptedText,
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Generate the document and download it
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
};
