"use client"

import { useState } from "react"
import { Camera, X, Wallet, AlertTriangle, Bell, Mail, Clock } from "lucide-react"

export function SettingsContent() {
  const [displayName, setDisplayName] = useState("jenzy.eth")
  const [email, setEmail] = useState("jenzy@gmail.com")
  const [bio, setBio] = useState("Web3 creator and KOL")
  const [notifications, setNotifications] = useState({
    newJobs: true,
    payments: true,
    deadlines: true,
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences</p>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Profile</h2>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] text-2xl font-bold text-white">
                JZ
              </div>
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] border border-white/10 text-muted-foreground transition-colors hover:text-foreground">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Profile Photo</p>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2D7A]/50"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2D7A]/50"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#FF2D7A]/50 focus:outline-none focus:ring-1 focus:ring-[#FF2D7A]/50"
            />
          </div>

          <button className="rounded-lg bg-[#FF2D7A] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#FF2D7A]/90">
            Save Changes
          </button>
        </div>
      </section>

      {/* Connected Accounts Section */}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Connected Accounts</h2>
        
        <div className="space-y-4">
          {/* Twitter/X */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <X className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">X (Twitter)</p>
                <p className="text-xs text-muted-foreground">@jenzy_eth</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                Connected
              </span>
              <button className="text-xs text-muted-foreground transition-colors hover:text-red-400">
                Disconnect
              </button>
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <Wallet className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Wallet</p>
                <p className="text-xs text-muted-foreground font-mono">0x1a2b...9f8e</p>
              </div>
            </div>
            <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
              Connected
            </span>
          </div>
        </div>
      </section>

      {/* Wallet Security Section */}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Wallet Security</h2>
        
        <div className="space-y-4">
          <button className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-transparent px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10">
            <AlertTriangle className="h-4 w-4" />
            Export Private Key
          </button>
          
          <p className="text-xs text-red-400/80">
            Your private key gives full access to your wallet. Never share it with anyone.
          </p>
          
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
            <p className="text-xs text-muted-foreground">
              Embedded wallet powered by Turnkey. Non-custodial — only you control your funds.
            </p>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Notifications</h2>
        
        <div className="space-y-4">
          {/* New Jobs Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Email notifications for new jobs</span>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, newJobs: !prev.newJobs }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notifications.newJobs ? "bg-[#FF2D7A]" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  notifications.newJobs ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Payments Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Payment received alerts</span>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, payments: !prev.payments }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notifications.payments ? "bg-[#FF2D7A]" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  notifications.payments ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Deadlines Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-foreground">Job deadline reminders</span>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, deadlines: !prev.deadlines }))}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                notifications.deadlines ? "bg-[#FF2D7A]" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  notifications.deadlines ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
