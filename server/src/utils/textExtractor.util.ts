import { IAdhaar } from "../core/domain/adhaar.entity.interface";

export const extractAadhaarData = (ocrText: string): IAdhaar => {
  const lines = ocrText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let name = "";
  let uid = "";
  let dob = "";
  let address = "";
  let gender = "";

  for (const line of lines) {
    const uidMatch = line.match(/(\d{4}\s*\d{4}\s*\d{4}|\d{12})/);
    if (uidMatch) {
      const cleanUid = uidMatch[1].replace(/\s/g, "");
      if (cleanUid.length === 12) {
        uid = cleanUid;
        break;
      }
    }
  }

  for (const line of lines) {
    const dobMatch1 = line.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (dobMatch1) {
      dob = dobMatch1[1];
      break;
    }

    const dobMatch2 = line.match(/(\d{8})/);
    if (dobMatch2 && dobMatch2[1] !== uid && dobMatch2[1].length === 8) {
      const dateStr = dobMatch2[1];
      dob = `${dateStr.substring(0, 2)}/${dateStr.substring(2, 4)}/${dateStr.substring(4, 8)}`;
      break;
    }
  }

  for (const line of lines) {
    const genderMatch = line.match(/\b(Male|Female|पुरुष|महिला)\b/i);
    if (genderMatch) {
      gender =
        genderMatch[1].toLowerCase() === "पुरुष"
          ? "Male"
          : genderMatch[1].toLowerCase() === "महिला"
            ? "Female"
            : genderMatch[1];
      break;
    }
  }

  for (const line of lines) {
    const skipKeywords = [
      "government",
      "india",
      "authority",
      "identification",
      "unique",
      "address",
      "uidai",
      "gov",
      "www",
      "help",
      "phone",
      "email",
    ];

    if (skipKeywords.some((keyword) => line.toLowerCase().includes(keyword))) {
      continue;
    }

    if (/\d{4}/.test(line) || line.includes("@") || line.includes(".")) {
      continue;
    }

    const nameMatch = line.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
    if (nameMatch && nameMatch[1].length > 3) {
      const potentialName = nameMatch[1];
      if (
        !potentialName.match(/^[A-Z]+$/) &&
        potentialName.split(" ").length <= 4
      ) {
        name = potentialName;
        break;
      }
    }
  }

  const addressLines = [];
  let addressStarted = false;

  for (const line of lines) {
    if (
      line.includes("S/O:") ||
      line.includes("D/O:") ||
      line.includes("W/O:") ||
      line.includes("Address:") ||
      line.match(/Ward\s*No/i) ||
      line.match(/\d{6}/) ||
      addressStarted
    ) {
      addressStarted = true;

      if (
        line.toLowerCase().includes("authority") ||
        line.toLowerCase().includes("government") ||
        line.includes("www.") ||
        line.includes("@")
      ) {
        addressStarted = false;
        continue;
      }

      addressLines.push(line);

      if (line.match(/\d{6}/) && addressLines.length > 1) {
        break;
      }
    }
  }

  address = addressLines
    .join(", ")
    .replace(/Address:\s*/, "")
    .trim();

  return {
    name: name || "Not found",
    uid: uid || "Not found",
    DOB: dob || "Not found",
    address: address || "Not found",
    gender: gender || "Not found",
  } as IAdhaar;
};
