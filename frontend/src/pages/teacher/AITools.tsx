import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { SuggestedQuestion } from "@/components/chat/SuggestedQuestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Send,
  Sparkles,
  FileText,
  Image,
  Download,
  Save,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { aiApi } from "@/lib/api";

const suggestedPrompts = [
  "Best ways to teach fractions to 5th graders?",
  "Creative writing prompts for my class",
  "How to make science more engaging?",
  "Classroom management tips",
];

export default function TeacherAI() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "chat";

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI teaching assistant. I can help with lesson planning, creating worksheets, generating visual aids, and answering teaching questions. How can I assist you today?",
      isBot: true,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Worksheet state
  const [worksheetForm, setWorksheetForm] = useState({
    subject: "",
    grade: "",
    topic: "",
    questionTypes: [] as string[],
    difficulty: [50],
  });
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Visual aid state
  const [visualPrompt, setVisualPrompt] = useState("");
  const [visualStyle, setVisualStyle] = useState("diagram");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSendChat = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setChatMessages((prev) => [...prev, { id: prev.length + 1, text, isBot: false }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await aiApi.chat(text, 'teacher');
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: response.response,
          isBot: true,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          isBot: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateWorksheet = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a worksheet for ${worksheetForm.subject || "General"} class, Grade ${worksheetForm.grade || "5"}, on the topic: ${worksheetForm.topic || "General Review"}. 
Include these question types: ${worksheetForm.questionTypes.join(", ") || "Multiple Choice, Short Answer"}. 
Difficulty level: ${worksheetForm.difficulty[0]}%. 
Format it nicely with sections and clear instructions.`;
      
      const response = await aiApi.chat(prompt, 'teacher');
      setGeneratedWorksheet(response.response);
    } catch (error) {
      setGeneratedWorksheet(`# ${worksheetForm.topic || "Worksheet"}\n\nError generating worksheet. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = () => {
    setIsGenerating(true);
    // Image generation would require a different API (like DALL-E)
    // For now, show a placeholder
    setTimeout(() => {
      setGeneratedImage("https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop");
      setIsGenerating(false);
    }, 2000);
  };

  const userName = user?.name || "Teacher";

  return (
    <MobileLayout role="teacher" userName={userName} schoolName="Lincoln Elementary">
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 grid grid-cols-3">
            <TabsTrigger value="chat" className="gap-1.5">
              <Sparkles className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="worksheet" className="gap-1.5">
              <FileText className="w-4 h-4" />
              Worksheet
            </TabsTrigger>
            <TabsTrigger value="visual" className="gap-1.5">
              <Image className="w-4 h-4" />
              Visual
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0 data-[state=inactive]:hidden">
            {chatMessages.length === 1 && (
              <div className="px-4 py-3 border-b border-border/50 bg-accent/30">
                <p className="text-sm text-muted-foreground mb-2">
                  Try asking:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <SuggestedQuestion
                      key={prompt}
                      question={prompt}
                      onClick={() => handleSendChat(prompt)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {chatMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.text}
                  isBot={msg.isBot}
                />
              ))}
              {isTyping && <ChatBubble message="" isBot isLoading />}
            </div>
            <div className="p-4 border-t border-border bg-card/95">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat(chatInput)}
                  placeholder="Ask anything about teaching..."
                  className="rounded-xl"
                />
                <Button onClick={() => handleSendChat(chatInput)} size="icon">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Worksheet Tab */}
          <TabsContent value="worksheet" className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden">
            <div className="p-4 space-y-6">
              {!generatedWorksheet ? (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select
                          value={worksheetForm.subject}
                          onValueChange={(v) =>
                            setWorksheetForm({ ...worksheetForm, subject: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Math</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Grade Level</Label>
                        <Select
                          value={worksheetForm.grade}
                          onValueChange={(v) =>
                            setWorksheetForm({ ...worksheetForm, grade: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                              <SelectItem key={g} value={g.toString()}>
                                Grade {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input
                        value={worksheetForm.topic}
                        onChange={(e) =>
                          setWorksheetForm({
                            ...worksheetForm,
                            topic: e.target.value,
                          })
                        }
                        placeholder="e.g., Fractions, Photosynthesis"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Question Types</Label>
                      <div className="space-y-2">
                        {["Multiple Choice", "Short Answer", "Matching", "True/False"].map(
                          (type) => (
                            <div key={type} className="flex items-center gap-2">
                              <Checkbox
                                id={type}
                                checked={worksheetForm.questionTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  setWorksheetForm({
                                    ...worksheetForm,
                                    questionTypes: checked
                                      ? [...worksheetForm.questionTypes, type]
                                      : worksheetForm.questionTypes.filter(
                                          (t) => t !== type
                                        ),
                                  });
                                }}
                              />
                              <Label htmlFor={type} className="font-normal">
                                {type}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Difficulty: {worksheetForm.difficulty[0]}%</Label>
                      <Slider
                        value={worksheetForm.difficulty}
                        onValueChange={(v) =>
                          setWorksheetForm({ ...worksheetForm, difficulty: v })
                        }
                        max={100}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Easy</span>
                        <span>Hard</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateWorksheet}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                    variant="gradient-teacher"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Worksheet
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <Card className="p-4">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {generatedWorksheet}
                    </pre>
                  </Card>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setGeneratedWorksheet(null)}>
                      Generate New
                    </Button>
                    <Button className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      Save to Library
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Visual Aid Tab */}
          <TabsContent value="visual" className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden">
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Describe what you need</Label>
                  <Input
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                    placeholder="e.g., A diagram of the water cycle"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["diagram", "cartoon", "realistic"].map((style) => (
                      <Button
                        key={style}
                        variant={visualStyle === style ? "default" : "outline"}
                        size="sm"
                        onClick={() => setVisualStyle(style)}
                        className="capitalize"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !visualPrompt}
                  className="w-full"
                  size="lg"
                  variant="gradient-teacher"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>

              {generatedImage && (
                <div className="space-y-3">
                  <Card className="overflow-hidden">
                    <img
                      src={generatedImage}
                      alt="Generated visual"
                      className="w-full h-auto"
                    />
                  </Card>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      Save to Library
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
