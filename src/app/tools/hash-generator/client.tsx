'use client'
import { useState } from 'react'
import ToolLayout from '@/components/ToolLayout'

async function hashText(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// MD5 pure JS implementation (Web Crypto doesn't support MD5)
function md5(input: string): string {
  function safeAdd(x: number, y: number) { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff) }
  function bitRotateLeft(num: number, cnt: number) { return (num << cnt) | (num >>> (32 - cnt)) }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b) }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & c) | (~b & d), a, b, x, s, t) }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(b ^ c ^ d, a, b, x, s, t) }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return md5cmn(c ^ (b | ~d), a, b, x, s, t) }

  const str = unescape(encodeURIComponent(input))
  const x: number[] = []
  for (let i = 0; i < str.length * 8; i += 8) x[i >> 5] = (x[i >> 5] || 0) | ((str.charCodeAt(i / 8) & 0xff) << i % 32)
  x[str.length * 8 >> 5] = (x[str.length * 8 >> 5] || 0) | (0x80 << str.length * 8 % 32)
  x[(((str.length * 8 + 64) >>> 9) << 4) + 14] = str.length * 8

  let [a, b, c, d] = [1732584193, -271733879, -1732584194, 271733878]
  for (let i = 0; i < x.length; i += 16) {
    const [oa, ob, oc, od] = [a, b, c, d]
    a = md5ff(a,b,c,d,x[i],7,-680876936); d = md5ff(d,a,b,c,x[i+1],12,-389564586); c = md5ff(c,d,a,b,x[i+2],17,606105819); b = md5ff(b,c,d,a,x[i+3],22,-1044525330)
    a = md5ff(a,b,c,d,x[i+4],7,-176418897); d = md5ff(d,a,b,c,x[i+5],12,1200080426); c = md5ff(c,d,a,b,x[i+6],17,-1473231341); b = md5ff(b,c,d,a,x[i+7],22,-45705983)
    a = md5ff(a,b,c,d,x[i+8],7,1770035416); d = md5ff(d,a,b,c,x[i+9],12,-1958414417); c = md5ff(c,d,a,b,x[i+10],17,-42063); b = md5ff(b,c,d,a,x[i+11],22,-1990404162)
    a = md5ff(a,b,c,d,x[i+12],7,1804603682); d = md5ff(d,a,b,c,x[i+13],12,-40341101); c = md5ff(c,d,a,b,x[i+14],17,-1502002290); b = md5ff(b,c,d,a,x[i+15],22,1236535329)
    a = md5gg(a,b,c,d,x[i+1],5,-165796510); d = md5gg(d,a,b,c,x[i+6],9,-1069501632); c = md5gg(c,d,a,b,x[i+11],14,643717713); b = md5gg(b,c,d,a,x[i],20,-373897302)
    a = md5gg(a,b,c,d,x[i+5],5,-701558691); d = md5gg(d,a,b,c,x[i+10],9,38016083); c = md5gg(c,d,a,b,x[i+15],14,-660478335); b = md5gg(b,c,d,a,x[i+4],20,-405537848)
    a = md5gg(a,b,c,d,x[i+9],5,568446438); d = md5gg(d,a,b,c,x[i+14],9,-1019803690); c = md5gg(c,d,a,b,x[i+3],14,-187363961); b = md5gg(b,c,d,a,x[i+8],20,1163531501)
    a = md5gg(a,b,c,d,x[i+13],5,-1444681467); d = md5gg(d,a,b,c,x[i+2],9,-51403784); c = md5gg(c,d,a,b,x[i+7],14,1735328473); b = md5gg(b,c,d,a,x[i+12],20,-1926607734)
    a = md5hh(a,b,c,d,x[i+5],4,-378558); d = md5hh(d,a,b,c,x[i+8],11,-2022574463); c = md5hh(c,d,a,b,x[i+11],16,1839030562); b = md5hh(b,c,d,a,x[i+14],23,-35309556)
    a = md5hh(a,b,c,d,x[i+1],4,-1530992060); d = md5hh(d,a,b,c,x[i+4],11,1272893353); c = md5hh(c,d,a,b,x[i+7],16,-155497632); b = md5hh(b,c,d,a,x[i+10],23,-1094730640)
    a = md5hh(a,b,c,d,x[i+13],4,681279174); d = md5hh(d,a,b,c,x[i],11,-358537222); c = md5hh(c,d,a,b,x[i+3],16,-722521979); b = md5hh(b,c,d,a,x[i+6],23,76029189)
    a = md5hh(a,b,c,d,x[i+9],4,-640364487); d = md5hh(d,a,b,c,x[i+12],11,-421815835); c = md5hh(c,d,a,b,x[i+15],16,530742520); b = md5hh(b,c,d,a,x[i+2],23,-995338651)
    a = md5ii(a,b,c,d,x[i],6,-198630844); d = md5ii(d,a,b,c,x[i+7],10,1126891415); c = md5ii(c,d,a,b,x[i+14],15,-1416354905); b = md5ii(b,c,d,a,x[i+5],21,-57434055)
    a = md5ii(a,b,c,d,x[i+12],6,1700485571); d = md5ii(d,a,b,c,x[i+3],10,-1894986606); c = md5ii(c,d,a,b,x[i+10],15,-1051523); b = md5ii(b,c,d,a,x[i+1],21,-2054922799)
    a = md5ii(a,b,c,d,x[i+8],6,1873313359); d = md5ii(d,a,b,c,x[i+15],10,-30611744); c = md5ii(c,d,a,b,x[i+6],15,-1560198380); b = md5ii(b,c,d,a,x[i+13],21,1309151649)
    a = md5ii(a,b,c,d,x[i+4],6,-145523070); d = md5ii(d,a,b,c,x[i+11],10,-1120210379); c = md5ii(c,d,a,b,x[i+2],15,718787259); b = md5ii(b,c,d,a,x[i+9],21,-343485551)
    a = safeAdd(a, oa); b = safeAdd(b, ob); c = safeAdd(c, oc); d = safeAdd(d, od)
  }
  return [a, b, c, d].map(n => {
    let s = ''
    for (let j = 0; j < 4; j++) s += ('0' + ((n >> j * 8) & 0xff).toString(16)).slice(-2)
    return s
  }).join('')
}

const ALGOS = [
  { id: 'MD5', label: 'MD5', bits: 128 },
  { id: 'SHA-1', label: 'SHA-1', bits: 160 },
  { id: 'SHA-256', label: 'SHA-256', bits: 256 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512 },
]

export default function HashClient() {
  const [input, setInput] = useState('')
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [uppercase, setUppercase] = useState(false)

  const generate = async () => {
    if (!input.trim()) return
    setLoading(true)
    const results: Record<string, string> = {}
    results['MD5'] = md5(input)
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-512']) {
      results[algo] = await hashText(input, algo)
    }
    setHashes(results)
    setLoading(false)
  }

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(uppercase ? val.toUpperCase() : val)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <ToolLayout title="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes" icon="#" category="Dev Tools">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Input text</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="accent-brand" />
              <span className="text-xs text-gray-500">Uppercase output</span>
            </label>
          </div>
          <textarea
            className="textarea-base h-32"
            placeholder="Enter any text to hash..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>

        <button onClick={generate} disabled={loading || !input.trim()} className="btn-brand">
          {loading ? 'Generating...' : 'Generate hashes'}
        </button>

        {Object.keys(hashes).length > 0 && (
          <div className="space-y-3 mt-2">
            {ALGOS.map(algo => {
              const val = hashes[algo.id] || ''
              const display = uppercase ? val.toUpperCase() : val
              return (
                <div key={algo.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-bold text-sm text-gray-800">{algo.label}</span>
                      <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{algo.bits}-bit</span>
                    </div>
                    <button onClick={() => copy(val, algo.id)} className="text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied === algo.id ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-xs text-gray-600 break-all font-mono leading-relaxed">{display}</code>
                </div>
              )
            })}
            <button onClick={() => copy(ALGOS.map(a => `${a.label}: ${uppercase ? hashes[a.id]?.toUpperCase() : hashes[a.id]}`).join('\n'), 'all')} className="btn-outline w-full">
              {copied === 'all' ? '✓ Copied all!' : 'Copy all hashes'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
