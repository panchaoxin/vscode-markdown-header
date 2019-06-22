export class MarkdownHeader {
    /** Mark of header in Markdown */
    private static readonly HEADER_MARK: string = "#";

    private static readonly HEADER_PATTERN: string = `^${MarkdownHeader.HEADER_MARK}+\\s+((\\d+\\.)+\\s+)?`;

    private static readonly MAX_LEVEL: number = 100;

    /**
     * Returns count of consecutive header marks at the beginning of the line
     */
    private static countHeaderMark(line: string): number {
        const chars = line.split("");
        let count: number = 0;
        chars.some(c => {
            if (c === this.HEADER_MARK) {
                count++;
                return false;
            } else {
                return true;
            }
        });
        return count;
    }
    
    private static generateNumber(line: string, levelOrder: number[]): string {
        const reg = new RegExp(this.HEADER_PATTERN, 'g');
    
        if (!reg.exec(line)) {
            return line;
        }

        const level = this.countHeaderMark(line);
        
        let newLine = '';
        for (let i = 0; i < level; i++) {
            newLine += '#';
        }
        newLine += ' ';
        for (let i = 1; i <= level; i++) {
            if (levelOrder[i] === 0) {
                levelOrder[i] = 1;
            }
            newLine += levelOrder[i] + '.';
        }
        newLine += ' ';
        newLine += line.substring(reg.lastIndex);
        return newLine;
    }

    private static removeNumber(line: string): string {
        const reg = new RegExp(this.HEADER_PATTERN, 'g');
        const level = this.countHeaderMark(line);
        if (level == 0) {
            return line;
        }
        line = line.replace(reg, '');
        let prefix = '';
        for (let i = 0; i < level; i++) {
            prefix += '#';
        }
        prefix += ' ';
        return prefix + line; 
    }

    /**
     * Generates multilevel order number to Markdown header
     */
    private static generateHeaderNumberInternal(lines: string[]) {
        let isInCodeArea = false;
        let lastLevel:number = -1;
        let levelOrder:number[] = new Array(this.MAX_LEVEL + 1);
        levelOrder.fill(0, 0, levelOrder.length);

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (line.startsWith("```")) {
                isInCodeArea = !isInCodeArea;
                continue;
            }

            if (!isInCodeArea && line.startsWith(this.HEADER_MARK)) {
                const level = this.countHeaderMark(line);
                if (level > this.MAX_LEVEL) {
                    throw new Error(`"${line.substring(0, 10)}..." Level of header cannot exceed ${this.MAX_LEVEL}`);
                }
                if (level < lastLevel) {
                    levelOrder.fill(0, level + 1, lastLevel + 1);
                }
                lastLevel = level;
                levelOrder[level]++;
                lines[i] = this.generateNumber(line, levelOrder);
            }
        }
    }

    public static generateHeaderNumber(content: string): string {
        let lines = content.split("\n");
        this.generateHeaderNumberInternal(lines);
        return lines.join("\n");
    }

    public static removeHeaderNumber(content: string): string {
        let lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            lines[i] = this.removeNumber(lines[i]);
        }
        return lines.join("\n");
    }
}