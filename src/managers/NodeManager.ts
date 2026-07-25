export interface NodeInfo {
  id: string;
  name: string;
  url: string;
  currentBots: number;
  maxBots: number; // Varsayılan: 10
  online: boolean;
  lastPing: number;
}

export class NodeManager {
  private nodes: Map<string, NodeInfo> = new Map();

  /**
   * Sisteme yeni bir Node ekler veya var olanı günceller
   */
  public registerNode(nodeData: Partial<NodeInfo> & { id: string; url: string }): NodeInfo {
    const existing = this.nodes.get(nodeData.id);

    const node: NodeInfo = {
      id: nodeData.id,
      name: nodeData.name || nodeData.id,
      url: nodeData.url,
      currentBots: existing ? existing.currentBots : (nodeData.currentBots || 0),
      maxBots: nodeData.maxBots || 10, // Varsayılan limit 10 bot
      online: true,
      lastPing: Date.now()
    };

    this.nodes.set(node.id, node);
    console.log(`[NodeManager] Node kaydedildi/güncellendi: ${node.id} (${node.currentBots}/${node.maxBots})`);
    return node;
  }

  /**
   * En az bota sahip ve 10 bot limitini aşmamış en uygun Node'u döner
   */
  public getAvailableNode(): NodeInfo | null {
    const activeNodes = Array.from(this.nodes.values()).filter(
      (node) => node.online && node.currentBots < node.maxBots
    );

    if (activeNodes.length === 0) {
      return null; // Müsait veya kapasitesi boş Node yok
    }

    // Bot sayısına göre küçükten büyüğe sırala (En az botu olan en başa gelir)
    activeNodes.sort((a, b) => a.currentBots - b.currentBots);

    return activeNodes[0];
  }

  /**
   * Belirtilen Node'un bot sayısını artırır
   */
  public incrementBotCount(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.currentBots += 1;
      this.nodes.set(nodeId, node);
    }
  }

  /**
   * Belirtilen Node'un bot sayısını eksiltir
   */
  public decrementBotCount(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node && node.currentBots > 0) {
      node.currentBots -= 1;
      this.nodes.set(nodeId, node);
    }
  }

  /**
   * Tüm Node'ların listesini döner (Master Paneli için)
   */
  public getAllNodes(): NodeInfo[] {
    return Array.from(this.nodes.values());
  }

  /**
   * ID'ye göre Node getirir
   */
  public getNode(id: string): NodeInfo | undefined {
    return this.nodes.get(id);
  }

  /**
   * Node'u sistemden siler
   */
  public removeNode(id: string): boolean {
    return this.nodes.delete(id);
  }
}