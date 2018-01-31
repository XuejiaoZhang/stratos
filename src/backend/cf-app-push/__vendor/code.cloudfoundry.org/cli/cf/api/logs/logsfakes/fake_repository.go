// This file was generated by counterfeiter
package logsfakes

import (
	"sync"

	"code.cloudfoundry.org/cli/cf/api/logs"
)

type FakeRepository struct {
	RecentLogsForStub        func(appGUID string) ([]logs.Loggable, error)
	recentLogsForMutex       sync.RWMutex
	recentLogsForArgsForCall []struct {
		appGUID string
	}
	recentLogsForReturns struct {
		result1 []logs.Loggable
		result2 error
	}
	TailLogsForStub        func(appGUID string, onConnect func(), logChan chan<- logs.Loggable, errChan chan<- error)
	tailLogsForMutex       sync.RWMutex
	tailLogsForArgsForCall []struct {
		appGUID   string
		onConnect func()
		logChan   chan<- logs.Loggable
		errChan   chan<- error
	}
	CloseStub        func()
	closeMutex       sync.RWMutex
	closeArgsForCall []struct{}
	invocations      map[string][][]interface{}
	invocationsMutex sync.RWMutex
}

func (fake *FakeRepository) RecentLogsFor(appGUID string) ([]logs.Loggable, error) {
	fake.recentLogsForMutex.Lock()
	fake.recentLogsForArgsForCall = append(fake.recentLogsForArgsForCall, struct {
		appGUID string
	}{appGUID})
	fake.recordInvocation("RecentLogsFor", []interface{}{appGUID})
	fake.recentLogsForMutex.Unlock()
	if fake.RecentLogsForStub != nil {
		return fake.RecentLogsForStub(appGUID)
	} else {
		return fake.recentLogsForReturns.result1, fake.recentLogsForReturns.result2
	}
}

func (fake *FakeRepository) RecentLogsForCallCount() int {
	fake.recentLogsForMutex.RLock()
	defer fake.recentLogsForMutex.RUnlock()
	return len(fake.recentLogsForArgsForCall)
}

func (fake *FakeRepository) RecentLogsForArgsForCall(i int) string {
	fake.recentLogsForMutex.RLock()
	defer fake.recentLogsForMutex.RUnlock()
	return fake.recentLogsForArgsForCall[i].appGUID
}

func (fake *FakeRepository) RecentLogsForReturns(result1 []logs.Loggable, result2 error) {
	fake.RecentLogsForStub = nil
	fake.recentLogsForReturns = struct {
		result1 []logs.Loggable
		result2 error
	}{result1, result2}
}

func (fake *FakeRepository) TailLogsFor(appGUID string, onConnect func(), logChan chan<- logs.Loggable, errChan chan<- error) {
	fake.tailLogsForMutex.Lock()
	fake.tailLogsForArgsForCall = append(fake.tailLogsForArgsForCall, struct {
		appGUID   string
		onConnect func()
		logChan   chan<- logs.Loggable
		errChan   chan<- error
	}{appGUID, onConnect, logChan, errChan})
	fake.recordInvocation("TailLogsFor", []interface{}{appGUID, onConnect, logChan, errChan})
	fake.tailLogsForMutex.Unlock()
	if fake.TailLogsForStub != nil {
		fake.TailLogsForStub(appGUID, onConnect, logChan, errChan)
	}
}

func (fake *FakeRepository) TailLogsForCallCount() int {
	fake.tailLogsForMutex.RLock()
	defer fake.tailLogsForMutex.RUnlock()
	return len(fake.tailLogsForArgsForCall)
}

func (fake *FakeRepository) TailLogsForArgsForCall(i int) (string, func(), chan<- logs.Loggable, chan<- error) {
	fake.tailLogsForMutex.RLock()
	defer fake.tailLogsForMutex.RUnlock()
	return fake.tailLogsForArgsForCall[i].appGUID, fake.tailLogsForArgsForCall[i].onConnect, fake.tailLogsForArgsForCall[i].logChan, fake.tailLogsForArgsForCall[i].errChan
}

func (fake *FakeRepository) Close() {
	fake.closeMutex.Lock()
	fake.closeArgsForCall = append(fake.closeArgsForCall, struct{}{})
	fake.recordInvocation("Close", []interface{}{})
	fake.closeMutex.Unlock()
	if fake.CloseStub != nil {
		fake.CloseStub()
	}
}

func (fake *FakeRepository) CloseCallCount() int {
	fake.closeMutex.RLock()
	defer fake.closeMutex.RUnlock()
	return len(fake.closeArgsForCall)
}

func (fake *FakeRepository) Invocations() map[string][][]interface{} {
	fake.invocationsMutex.RLock()
	defer fake.invocationsMutex.RUnlock()
	fake.recentLogsForMutex.RLock()
	defer fake.recentLogsForMutex.RUnlock()
	fake.tailLogsForMutex.RLock()
	defer fake.tailLogsForMutex.RUnlock()
	fake.closeMutex.RLock()
	defer fake.closeMutex.RUnlock()
	return fake.invocations
}

func (fake *FakeRepository) recordInvocation(key string, args []interface{}) {
	fake.invocationsMutex.Lock()
	defer fake.invocationsMutex.Unlock()
	if fake.invocations == nil {
		fake.invocations = map[string][][]interface{}{}
	}
	if fake.invocations[key] == nil {
		fake.invocations[key] = [][]interface{}{}
	}
	fake.invocations[key] = append(fake.invocations[key], args)
}

var _ logs.Repository = new(FakeRepository)