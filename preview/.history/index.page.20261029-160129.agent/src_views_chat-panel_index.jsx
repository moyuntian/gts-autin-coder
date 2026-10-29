import { useState } from "react";
import { Button, Input } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import InfoGrid from "../../components/info-grid/index.jsx";
import "./index.css";

export default function ChatPanel() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  const handleConfirm = () => setSent(true);
  const handleRegenerate = () => setSent(false);

  return (
    <section className="chat-panel">
      <div className="chat-panel__scroll">
        <div className="chat-msg">
          <div className="chat-msg__head">
            <span className="chat-msg__avatar">
              <Icon name="bot" size="0.875rem" />
            </span>
            <span className="chat-msg__name">无线网络智能体</span>
            <span className="chat-msg__time">10:04:20</span>
          </div>

          {sent ? (
            <div className="chat-msg__body">
              <InfoGrid
                labelWidth="4.5rem"
                rows={[
                  [
                    "执行结果",
                    <span>
                      已确认下发命令 <code className="chat-code">STR CPRILBRNEG:RCN=0</code>
                      ，正在执行并持续跟踪小区退服恢复情况。
                    </span>,
                  ],
                ]}
              />
            </div>
          ) : (
            <div className="chat-msg__body">
              <InfoGrid
                labelWidth="4.5rem"
                rows={[
                  [
                    "修复方案",
                    <span>
                      是否执行命令 <code className="chat-code">STR CPRILBRNEG:RCN=0</code> 以修复本次故障？
                    </span>,
                  ],
                  [
                    "操作提示",
                    "执行此操作单板会下电复位并中断承载于此单板的业务，如果分离主控对端的业务通过该单板接入则可能影响对端业务，且此操作会造成日志丢失，建议执行前先备份日志，是否确认继续执行？",
                  ],
                ]}
              />
            </div>
          )}

          <div className="chat-msg__actions">
            {sent ? (
              <Button onClick={handleRegenerate} icon={<Icon name="undo-2" size="0.875rem" />}>
                撤回确认
              </Button>
            ) : (
              <>
                <Button onClick={handleRegenerate} icon={<Icon name="refresh-cw" size="0.875rem" />}>
                  重新生成
                </Button>
                <Button
                  type="primary"
                  onClick={handleConfirm}
                  icon={<Icon name="check" size="0.875rem" />}
                >
                  确认下发
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="chat-panel__input">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="输入问题或输入'/'触发提示词"
          suffix={
            <span className={"chat-send" + (draft ? " is-ready" : "")}>
              <Icon name="send-horizontal" size="0.875rem" />
            </span>
          }
        />
      </div>
    </section>
  );
}
