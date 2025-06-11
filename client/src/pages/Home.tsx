import React, { useEffect, useState } from "react";
import { FileText, Camera, History, CheckCircle, Copy } from "lucide-react";
import { ImageSelect } from "../components/ImageSelect";
import { getPrviousRecords, processAdhaar } from "../services/adhaar.service";
import { validateFile } from "../helpers/validateFile";
import { getSystemId, setSystemId } from "../helpers/uuid";
import type { IAdhaar } from "../types/IAdhaar";
import { toast } from "sonner";
import { formatDate } from "../helpers/fomateDate";

const Home: React.FC = () => {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentParsedData, setCurrentParsedData] = useState<IAdhaar | null>(
    null
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [frontError, setFrontError] = useState<string | null>(null);
  const [backError, setBackError] = useState<string | null>(null);

  const [previousData, setPrviousData] = useState<IAdhaar[]>([]);

  useEffect(() => {
    if (showHistory) {
      getHistory();
    }
  }, [showHistory]);

  const getHistory = async () => {
    const systemId = getSystemId();

    if (!systemId) {
      return null;
    }

    try {
      const history = await getPrviousRecords(systemId);
      setPrviousData(history);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const handleParseAadhaar = async () => {
    if (!frontFile || !backFile) {
      setFrontError("Please provide image");
      setBackError("Please provide image");
      return null;
    }

    const frontError = validateFile(frontFile);

    if (frontError) {
      setFrontError(frontError);
      return;
    }

    const backError = validateFile(backFile);

    if (backError) {
      setBackError(backError);
      return null;
    }

    let systemId = getSystemId();

    if (!systemId) {
      systemId = setSystemId();
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("front", frontFile);
      formData.append("back", backFile);
      formData.append("systemId", systemId);

      const result = await processAdhaar(formData);

      setCurrentParsedData(result);
      setIsLoading(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedField(null)
        setCopiedItem(null)
      }
        , 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const copyAllData = async (data: IAdhaar) => {
    const allData = `Name: ${data.name}
Aadhaar Number: ${data.uid}
Date of Birth: ${data.DOB}
Address: ${data.address}
Gender: ${data.gender}
Parsed At: ${formatDate(data.createdAt)}`;

    setCopiedItem(data._id)
    await copyToClipboard(allData, "all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-black px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Aadhaar Parser
                  </h1>
                  <p className="text-blue-100">
                    Upload and extract Aadhaar card information
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <History className="w-5 h-5" />
                <span>History</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div
              className={`${
                showHistory ? "lg:w-1/3" : "lg:w-1/2"
              } p-8 border-r border-gray-100`}
            >
              <ImageSelect
                label="Aadhaar Front"
                onFileSelect={setFrontFile}
                selectedFile={frontFile}
                errorText={frontError}
              />

              <ImageSelect
                label="Aadhaar Back"
                onFileSelect={setBackFile}
                selectedFile={backFile}
                errorText={backError}
              />

              <button
                onClick={handleParseAadhaar}
                disabled={isLoading || !frontFile || !backFile}
                className="w-full bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "PARSE AADHAAR"
                )}
              </button>
            </div>
            <div
              className={`${
                showHistory ? "lg:w-1/3" : "lg:w-1/2"
              } p-8 bg-gradient-to-br from-gray-50 to-slate-100`}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Adhaar Details
              </h2>

              <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] shadow-sm">
                {currentParsedData ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">Data Extracted</span>
                      </div>
                      <button
                        onClick={() => copyAllData(currentParsedData)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                        title="Copy all data"
                      >
                        {copiedField === "all" && copiedItem === currentParsedData._id ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">
                            {currentParsedData.name}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(currentParsedData.name, "name")
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedField === "name" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">
                            Aadhaar Number
                          </p>
                          <p className="font-medium font-mono">
                            {currentParsedData.uid}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(currentParsedData.uid, "aadhaar")
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedField === "aadhaar" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">{currentParsedData.DOB}</p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(currentParsedData.DOB, "dob")
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedField === "dob" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium">
                            {currentParsedData.gender}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(currentParsedData.gender, "gender")
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {copiedField === "gender" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">
                            {currentParsedData.address}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              currentParsedData.address,
                              "address"
                            )
                          }
                          className="text-gray-500 hover:text-gray-700 ml-2 mt-1"
                        >
                          {copiedField === "address" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 pt-2">
                        Parsed at: {formatDate(currentParsedData.createdAt)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FileText className="w-12 h-12 mb-3" />
                    <p className="text-center">
                      Please upload by inputting your Aadhaar front and
                      back
                    </p>
                  </div>
                )}
              </div>
            </div>
            {showHistory && (
              <div className="lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Previous Parses
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {previousData.map((data) => (
                    <div
                      key={data._id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">
                          {data.name}
                        </h4>
                        <button
                          onClick={() => copyAllData(data)}
                          className="text-gray-600 hover:text-black transition-colors"
                          title="Copy all data"
                        >
                          {copiedField === "all" && copiedItem === data._id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Aadhaar: {data.uid}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(data.createdAt)}
                      </p>
                      <button
                        onClick={() => setCurrentParsedData(data)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                  {previousData.length === 0 ? (
                    <p>No prevoius history</p>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
