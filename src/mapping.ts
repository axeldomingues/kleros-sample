import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  Contract,
  NewPhase,
  NewPeriod,
  StakeSet,
  Draw,
  TokenAndETHShift,
  DisputeCreation,
  AppealPossible,
  AppealDecision
} from "../generated/Contract/Contract"
import { Dispute, Period } from "../generated/schema"

export function handleNewPhase(event: NewPhase): void {}

export function handleNewPeriod(event: NewPeriod): void {
  let periodId = String.fromCharCode(event.params._period)
  let disputeId = event.params._disputeID.toString()
  let newPeriodEntity = Period.load(periodId)
  let disputeEntity = Dispute.load(disputeId)

  // check if this is a new period
  if (newPeriodEntity != null) {
    newPeriodEntity.period = event.params._period
    newPeriodEntity.totalDisputes = newPeriodEntity.totalDisputes.plus(BigInt.fromI32(1))
    log.info('Incremented dispute count', [periodId])
  } else {
    newPeriodEntity = new Period(periodId)
    newPeriodEntity.period = event.params._period
    newPeriodEntity.totalDisputes = BigInt.fromI32(1)
    log.info('Initialized Period', [periodId])
  }

  // check if this new period is for an existing dispute
  if (disputeEntity != null) {
    // this new period is for an existing dispute; thus, we have to adjust the total disputes of this previous period
    let previousPeriodEntity = Period.load(disputeEntity.period)
    previousPeriodEntity.totalDisputes = previousPeriodEntity.totalDisputes.minus(BigInt.fromI32(1))
    previousPeriodEntity.save()
    log.info('Decremented dispute count', [periodId])
  } else {
    disputeEntity = new Dispute(disputeId)
  }

  disputeEntity.period = periodId

  newPeriodEntity.save()
  disputeEntity.save()
}

export function handleStakeSet(event: StakeSet): void {}

export function handleDraw(event: Draw): void {}

export function handleTokenAndETHShift(event: TokenAndETHShift): void {}

export function handleDisputeCreation(event: DisputeCreation): void {}

export function handleAppealPossible(event: AppealPossible): void {}

export function handleAppealDecision(event: AppealDecision): void {}
