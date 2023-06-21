"use client"
import { use, useEffect, useState } from "react"
import styles from "@/app/styles/translator-for-dev3/index.module.scss"

async function testChat(message: string) {
  const data = await fetch('/api/testChat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: message })
  })
    .then(response => response.json())
    .catch(error => console.error(error))

  return data
}

export default function Page() {
  type TranslateData = {
    japanese: string
    commitMessage: string
    branchName: string
  }
  const [loading, setLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")
  const [translateData, setTranslateData] = useState<TranslateData[]>([])
  const [error, setError] = useState("")

  return (
    <div className={styles.page}>
      {translateData.map((data, index) => (
        <div key={index} className={styles.translateSection}>
          <p className={styles.japanese}>{data.japanese}</p>
          <p className={styles.arrow}>&gt;</p>
          <div className={styles.output}>
            <div className={styles.branch}>
              <p className={styles.label}>Branch Name</p>
              <p className={styles.value}>{data.branchName}</p>
            </div>
            <div className={styles.commit}>
              <p className={styles.label}>Commit Message</p>
              <p className={styles.value}>{data.commitMessage}</p>
            </div>
          </div>
        </div>
      ))}
      <div className={styles.translateSection}>
        <input
          type="text"
          placeholder="実装内容を端的に入力してください。"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={loading ? styles.loading : ""}
          onClick={() => {
            setLoading(true)
            testChat(input)
              .then(response => {
                const line = response.split("\n")

                if (line.length <= 1) {
                  setError("翻訳機にエラーがありました。")
                  return
                }

                setTranslateData([...translateData, {
                  japanese: input,
                  commitMessage: line[0],
                  branchName: line[1],
                }])
              })
              .finally(() => {
                setInput("")
                setLoading(false)
              })
          }}>
          <p>&gt;</p>
        </button>
        <div className={`${styles.output} ${styles.onlyLable}`}>
          <div className={styles.branch}>
            <p className={styles.label}>Branch Name</p>
          </div>
          <div className={styles.commit}>
            <p className={styles.label}>Commit Message</p>
          </div>
        </div>
      </div>
    </div>
  )
}
