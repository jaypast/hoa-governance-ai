import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertConversationSchema, insertDocumentSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // Conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const userId = "demo-user"; // In production, get from session
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const result = insertConversationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }
      const conversation = await storage.createConversation(result.data);
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse({
        ...req.body,
        conversationId: req.params.id
      });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }
      const message = await storage.createMessage(result.data);
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Documents
  app.get("/api/documents", async (req, res) => {
    try {
      const userId = "demo-user"; // In production, get from session
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const result = insertDocumentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }
      const document = await storage.createDocument(result.data);
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/documents/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      const document = await storage.updateDocumentStatus(req.params.id, status);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Citations
  app.get("/api/citations", async (req, res) => {
    try {
      const citations = await storage.getCitations();
      res.json(citations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI Chat endpoint (mock for now)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      // Store user message
      await storage.createMessage({
        conversationId,
        role: "user",
        content: message,
        citations: null,
        messageType: null
      });

      // Generate AI response (mock)
      const aiResponse = generateAIResponse(message);
      
      // Store AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.content,
        citations: aiResponse.citations,
        messageType: aiResponse.type
      });

      res.json(aiMessage);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

// Mock AI response generator
function generateAIResponse(message: string): { content: string; citations: string[]; type: string } {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("notice") || lowerMessage.includes("amend")) {
    return {
      content: `Based on your governing documents and Texas law:

**Your CC&Rs (Section 3.5)** require written notice 30 days before any meeting where rule amendments will be voted upon.

**Texas Property Code §209.0052** requires the association to give written notice of a proposed rule change to each owner before a meeting at which the proposed rule change will be considered.

⚠️ **Key Point:** Your CC&Rs' 30-day requirement is stricter than the state minimum, so the 30-day rule applies.

**Next Steps:**
1. Draft the proposed rule amendment
2. Prepare notice with specific rule text and meeting date
3. Distribute to all owners at least 30 days before meeting
4. Document delivery method for each owner`,
      citations: ["CC&Rs Section 3.5", "Texas Property Code §209.0052"],
      type: "answer"
    };
  }
  
  if (lowerMessage.includes("emergency") || lowerMessage.includes("meeting")) {
    return {
      content: `Regarding emergency meetings:

**Your Bylaws (Section 4.1)** state: "The president may call a special meeting upon 48 hours' notice..."

**Texas Property Code §209.0053** states: "Notice of meeting must be provided no less than 72 hours in advance..."

⚠️ **Potential Conflict:** Your bylaws say 48 hours, but state law requires 72 hours—**state law prevails**.

**Important:** Under Chapter 209.0053, boards can only call emergency meetings every 90 days for true emergencies.

**Recommendation:** Always provide at least 72 hours notice to remain compliant with state law.`,
      citations: ["Bylaws Section 4.1", "Texas Property Code §209.0053"],
      type: "answer"
    };
  }

  return {
    content: `I've reviewed your question against your governing documents and Texas Property Code. 

Based on your **CC&Rs** and **Bylaws**, along with relevant sections of **Texas Property Code Chapters 201-209**, here's what I found:

This topic may require specific analysis of your documents. I recommend:
1. Uploading relevant sections of your CC&Rs
2. Specifying the exact situation or scenario
3. Consulting with your HOA attorney for legal interpretation

Would you like me to help you draft a research memo on this topic, or would you prefer to explore a specific document template?`,
    citations: ["CC&Rs", "Texas Property Code Ch. 209"],
    type: "answer"
  };
}
